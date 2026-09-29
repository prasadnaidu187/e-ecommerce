package com.ecommerce.address.repository;

import com.ecommerce.address.entity.Address;
import com.ecommerce.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository
        extends JpaRepository<Address, Long> {

    List<Address> findByUser(User user);
}