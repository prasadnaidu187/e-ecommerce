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

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

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

    public OrderResponse createOrder(
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        List<Cart> cartItems =
                cartRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Cart cart : cartItems) {

            BigDecimal itemTotal =
                    cart.getProduct()
                            .getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            cart.getQuantity()
                                    )
                            );

            totalAmount =
                    totalAmount.add(itemTotal);
        }

        Order order = new Order();

        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder =
                orderRepository.save(order);

        for (Cart cart : cartItems) {

            OrderItem orderItem =
                    new OrderItem();

            orderItem.setOrder(savedOrder);
            orderItem.setProduct(
                    cart.getProduct()
            );

            orderItem.setQuantity(
                    cart.getQuantity()
            );

            orderItem.setPrice(
                    cart.getProduct().getPrice()
            );

            orderItemRepository.save(orderItem);
        }

        cartRepository.deleteAll(cartItems);

        return mapToResponse(savedOrder);
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

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                ));

        if (!order.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not authorized to access this order"
            );
        }

        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(
            Order order
    ) {

        List<OrderItemResponse> items =
                orderItemRepository
                        .findByOrderId(order.getId())
                        .stream()
                        .map(item ->
                                new OrderItemResponse(
                                        item.getId(),
                                        item.getProduct().getId(),
                                        item.getProduct().getName(),
                                        item.getQuantity(),
                                        item.getPrice()
                                )
                        )
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