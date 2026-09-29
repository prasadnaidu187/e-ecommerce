package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.CartRequest;
import com.ecommerce.cart.dto.CartResponse;
import com.ecommerce.cart.service.CartService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(
            CartService cartService
    ) {
        this.cartService = cartService;
    }


    // ================= ADD TO CART =================

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody CartRequest request,
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        CartResponse response =
                cartService.addToCart(
                        email,
                        request
                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ================= GET MY CART =================

    @GetMapping
    public ResponseEntity<List<CartResponse>> getCart(
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        List<CartResponse> cart =
                cartService.getCart(email);


        return ResponseEntity.ok(cart);
    }


    // ================= UPDATE QUANTITY =================

    @PutMapping("/{cartId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable Long cartId,
            @RequestBody CartRequest request,
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        CartResponse response =
                cartService.updateQuantity(
                        email,
                        cartId,
                        request.getQuantity()
                );


        return ResponseEntity.ok(response);
    }


    // ================= REMOVE ITEM =================

    @DeleteMapping("/{cartId}")
    public ResponseEntity<String> removeFromCart(
            @PathVariable Long cartId,
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        cartService.removeFromCart(
                email,
                cartId
        );


        return ResponseEntity.ok(
                "Item removed from cart"
        );
    }


    // ================= CLEAR CART =================

    @DeleteMapping
    public ResponseEntity<String> clearCart(
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        cartService.clearCart(email);


        return ResponseEntity.ok(
                "Cart cleared successfully"
        );
    }
}

