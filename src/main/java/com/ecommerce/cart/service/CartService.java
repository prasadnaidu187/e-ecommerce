package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.CartRequest;
import com.ecommerce.cart.dto.CartResponse;
import com.ecommerce.cart.entity.Cart;
import com.ecommerce.cart.repository.CartRepository;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    // ================= ADD TO CART =================

    public CartResponse addToCart(
            String email,
            CartRequest request
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found")
                );


        // Check stock

        if (product.getQuantity() < request.getQuantity()) {

            throw new RuntimeException(
                    "Not enough product stock"
            );

        }


        // Check whether product already exists in cart

        Cart cart = cartRepository
                .findByUserAndProduct(user, product)
                .orElse(null);


        if (cart != null) {

            int newQuantity =
                    cart.getQuantity()
                            + request.getQuantity();


            if (newQuantity > product.getQuantity()) {

                throw new RuntimeException(
                        "Requested quantity exceeds available stock"
                );

            }

            cart.setQuantity(newQuantity);

        } else {

            cart = new Cart(
                    user,
                    product,
                    request.getQuantity()
            );

        }


        Cart savedCart =
                cartRepository.save(cart);


        return convertToResponse(savedCart);
    }


    // ================= GET USER CART =================

    public List<CartResponse> getCart(
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        return cartRepository
                .findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // ================= REMOVE ITEM =================

    public void removeFromCart(
            String email,
            Long cartId
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        Cart cart = cartRepository
                .findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found")
                );


        if (!cart.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot remove another user's cart item"
            );

        }


        cartRepository.delete(cart);
    }


    // ================= CLEAR CART =================

    public void clearCart(
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        cartRepository.deleteByUser(user);
    }


    // ================= CONVERT ENTITY → DTO =================

    private CartResponse convertToResponse(
            Cart cart
    ) {

        Product product =
                cart.getProduct();


        BigDecimal totalPrice =
                product.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        cart.getQuantity()
                                )
                        );


        return new CartResponse(

                cart.getId(),

                product.getId(),

                product.getName(),

                product.getPrice(),

                cart.getQuantity(),

                totalPrice
        );
    }
}