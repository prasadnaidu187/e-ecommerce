package com.ecommerce.address.controller;

import com.ecommerce.address.dto.AddressRequest;
import com.ecommerce.address.dto.AddressResponse;
import com.ecommerce.address.service.AddressService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // Create address
    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @Valid @RequestBody AddressRequest request,
            Authentication authentication
    ) {

        AddressResponse response =
                addressService.createAddress(request, authentication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all my addresses
    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                addressService.getMyAddresses(authentication)
        );
    }

    // Get one address
    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddress(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                addressService.getAddress(id, authentication)
        );
    }

    // Update address
    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                addressService.updateAddress(
                        id,
                        request,
                        authentication
                )
        );
    }

    // Delete address
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddress(
            @PathVariable Long id,
            Authentication authentication
    ) {

        addressService.deleteAddress(id, authentication);

        return ResponseEntity.ok("Address deleted successfully");
    }
}