
package com.ecommerce.config;

import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Get Authorization header
        String authHeader =
                request.getHeader("Authorization");

        System.out.println("Authorization Header: " + authHeader);

        // Check whether Bearer token exists
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT token
        String token =
                authHeader.substring(7);

        // Validate JWT
        if (jwtService.isTokenValid(token)) {

            System.out.println("JWT Token is valid");

            // Extract email from JWT
            String email =
                    jwtService.extractEmail(token);

            System.out.println("Email from JWT: " + email);

            // Find user in database
            User user = userRepository
                    .findByEmail(email)
                    .orElse(null);

            if (user != null) {

                System.out.println(
                        "User found: " + user.getEmail()
                );

                // Get role from database
                String role = user.getRole();

                System.out.println(
                        "Role from database: " + role
                );

                // Convert USER -> ROLE_USER
                // Convert ADMIN -> ROLE_ADMIN
                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        );

                System.out.println(
                        "Spring Security Authority: "
                                + authority.getAuthority()
                );

                // Create authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(authority)
                        );

                // Store authentication in SecurityContext
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                System.out.println(
                        "Authentication stored successfully"
                );
            } else {

                System.out.println(
                        "User NOT found in database"
                );
            }

        } else {

            System.out.println("JWT Token is INVALID");
        }

        // Continue request
        filterChain.doFilter(request, response);
    }
}
