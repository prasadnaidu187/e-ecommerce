
package com.ecommerce.order.controller;

import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.service.OrderService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Create a pending order and Razorpay payment order.
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPaymentOrder(
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.createPaymentOrder(authentication));
    }

    // Verify the payment and confirm the local order.
    @PostMapping("/verify-payment")
    public ResponseEntity<OrderResponse> verifyPayment(
            @RequestBody Map<String, Object> request,
            Authentication authentication
    ) {
        Long localOrderId = Long.valueOf(
                request.get("localOrderId").toString()
        );

        String razorpayOrderId =
                request.get("razorpay_order_id").toString();

        String razorpayPaymentId =
                request.get("razorpay_payment_id").toString();

        String razorpaySignature =
                request.get("razorpay_signature").toString();

        OrderResponse response = orderService.verifyPayment(
                localOrderId,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
                authentication
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                orderService.getMyOrders(authentication)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                orderService.getOrder(id, authentication)
        );
    }
}
