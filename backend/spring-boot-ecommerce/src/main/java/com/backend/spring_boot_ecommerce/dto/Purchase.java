package com.backend.spring_boot_ecommerce.dto;

import com.backend.spring_boot_ecommerce.entity.Address;
import com.backend.spring_boot_ecommerce.entity.Customer;
import com.backend.spring_boot_ecommerce.entity.OrderItem;
import com.backend.spring_boot_ecommerce.entity.Orders;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Orders order;
    private Set<OrderItem> orderItems;

}
