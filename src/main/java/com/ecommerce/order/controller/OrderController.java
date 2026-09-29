package com.ecommerce.order.controller;

import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.service.OrderService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Checkout - Create Order from Cart
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            Authentication authentication
    ) {

        OrderResponse response =
                orderService.createOrder(authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all orders of logged-in user
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                orderService.getMyOrders(authentication)
        );
    }

    // Get one order
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                orderService.getOrder(
                        id,
                        authentication
                )
        );
    }
}