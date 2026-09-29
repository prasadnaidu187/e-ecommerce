package com.ecommerce.address.service;

import com.ecommerce.address.dto.AddressRequest;
import com.ecommerce.address.dto.AddressResponse;
import com.ecommerce.address.entity.Address;
import com.ecommerce.address.repository.AddressRepository;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(
            AddressRepository addressRepository,
            UserRepository userRepository
    ) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    // Get currently logged-in user from JWT
    private User getLoggedInUser(Authentication authentication) {

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    // Create address
    public AddressResponse createAddress(
            AddressRequest request,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        Address address = new Address();

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        address.setUser(user);

        Address savedAddress = addressRepository.save(address);

        return mapToResponse(savedAddress);
    }

    // Get all addresses of logged-in user
    public List<AddressResponse> getMyAddresses(
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        return addressRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get one address
    public AddressResponse getAddress(
            Long id,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        Address address = addressRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Address not found")
                );

        checkOwnership(address, user);

        return mapToResponse(address);
    }

    // Update address
    public AddressResponse updateAddress(
            Long id,
            AddressRequest request,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        Address address = addressRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Address not found")
                );

        checkOwnership(address, user);

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        Address updatedAddress = addressRepository.save(address);

        return mapToResponse(updatedAddress);
    }

    // Delete address
    public void deleteAddress(
            Long id,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        Address address = addressRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Address not found")
                );

        checkOwnership(address, user);

        addressRepository.delete(address);
    }

    // Make sure user can access only their own address
    private void checkOwnership(Address address, User user) {

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to access this address");
        }
    }

    // Convert Entity → Response
    private AddressResponse mapToResponse(Address address) {

        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getPhone(),
                address.getAddressLine(),
                address.getCity(),
                address.getState(),
                address.getPincode()
        );
    }
}