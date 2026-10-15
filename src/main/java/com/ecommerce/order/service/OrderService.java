
package com.ecommerce.order.service;

import com.ecommerce.cart.entity.Cart;
import com.ecommerce.cart.repository.CartRepository;
import com.ecommerce.order.dto.OrderItemResponse;
import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.repository.OrderItemRepository;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    // Create a pending order and a Razorpay payment order.
    @Transactional
    public Map<String, Object> createPaymentOrder(
            Authentication authentication
    ) {
        try {
            User user = getLoggedInUser(authentication);

            List<Cart> cartItems = cartRepository.findByUser(user);

            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            BigDecimal totalAmount = BigDecimal.ZERO;

            for (Cart cart : cartItems) {
                BigDecimal itemTotal =
                        cart.getProduct().getPrice()
                                .multiply(BigDecimal.valueOf(
                                        cart.getQuantity()
                                ));

                totalAmount = totalAmount.add(itemTotal);
            }

            if (totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Invalid order amount");
            }

            // Save a pending local order.
            Order order = new Order();
            order.setUser(user);
            order.setTotalAmount(totalAmount);
            order.setStatus("PENDING");
            order.setPaymentStatus("PENDING");
            order.setOrderDate(LocalDateTime.now());

            Order savedOrder = orderRepository.save(order);

            // Save a snapshot of the cart items.
            for (Cart cart : cartItems) {
                OrderItem item = new OrderItem();
                item.setOrder(savedOrder);
                item.setProduct(cart.getProduct());
                item.setQuantity(cart.getQuantity());
                item.setPrice(cart.getProduct().getPrice());

                orderItemRepository.save(item);
            }

            // Razorpay expects the amount in paise.
            long amountInPaise = totalAmount
                    .multiply(BigDecimal.valueOf(100))
                    .longValueExact();

            RazorpayClient client = new RazorpayClient(
                    razorpayKeyId,
                    razorpayKeySecret
            );

            JSONObject request = new JSONObject();
            request.put("amount", amountInPaise);
            request.put("currency", "INR");
            request.put("receipt", "order-" + savedOrder.getId());

            com.razorpay.Order razorpayOrder =
                    client.orders.create(request);

            String razorpayOrderId =
                    razorpayOrder.get("id").toString();

            savedOrder.setRazorpayOrderId(razorpayOrderId);
            orderRepository.save(savedOrder);

            // Send the information needed by Razorpay Checkout.
            Map<String, Object> response = new HashMap<>();
            response.put("localOrderId", savedOrder.getId());
            response.put("razorpayOrderId", razorpayOrderId);
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("keyId", razorpayKeyId);
            response.put("name", "E-Commerce Store");
            response.put("description", "Order #" + savedOrder.getId());
            response.put("email", user.getEmail());

            return response;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Could not create payment order: " + e.getMessage(),
                    e
            );
        }
    }

    // Verify Razorpay's payment signature before confirming the order.
    @Transactional
    public OrderResponse verifyPayment(
            Long localOrderId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature,
            Authentication authentication
    ) {
        try {
            User user = getLoggedInUser(authentication);

            Order order = orderRepository.findById(localOrderId)
                    .orElseThrow(() ->
                            new RuntimeException("Order not found"));

            if (!order.getUser().getId().equals(user.getId())) {
                throw new RuntimeException(
                        "You are not authorized to access this order"
                );
            }

            if (order.getRazorpayOrderId() == null
                    || !order.getRazorpayOrderId()
                            .equals(razorpayOrderId)) {
                throw new RuntimeException(
                        "Razorpay order ID does not match"
                );
            }

            // Make successful verification safe to retry.
            if ("PAID".equals(order.getPaymentStatus())) {
                return mapToResponse(order);
            }

            JSONObject paymentData = new JSONObject();
            paymentData.put("razorpay_order_id", razorpayOrderId);
            paymentData.put("razorpay_payment_id", razorpayPaymentId);
            paymentData.put("razorpay_signature", razorpaySignature);

            boolean valid = Utils.verifyPaymentSignature(
                    paymentData,
                    razorpayKeySecret
            );

            if (!valid) {
                throw new RuntimeException(
                        "Payment signature verification failed"
                );
            }

            order.setRazorpayPaymentId(razorpayPaymentId);
            order.setPaymentStatus("PAID");
            order.setStatus("PLACED");

            Order savedOrder = orderRepository.save(order);

            // Clear the cart only after successful verification.
            List<Cart> cartItems = cartRepository.findByUser(user);
            cartRepository.deleteAll(cartItems);

            return mapToResponse(savedOrder);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Payment verification failed: " + e.getMessage(),
                    e
            );
        }
    }

    public List<OrderResponse> getMyOrders(
            Authentication authentication
    ) {
        User user = getLoggedInUser(authentication);

        return orderRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrderResponse getOrder(
            Long orderId,
            Authentication authentication
    ) {
        User user = getLoggedInUser(authentication);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to access this order"
            );
        }

        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items =
                orderItemRepository.findByOrderId(order.getId())
                        .stream()
                        .map(item -> new OrderItemResponse(
                                item.getId(),
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getQuantity(),
                                item.getPrice()
                        ))
                        .toList();

        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderDate(),
                items
        );
    }
}
