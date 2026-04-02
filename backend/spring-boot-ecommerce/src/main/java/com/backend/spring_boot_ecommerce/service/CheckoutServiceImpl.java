package com.backend.spring_boot_ecommerce.service;

import com.backend.spring_boot_ecommerce.dao.CustomerRepository;
import com.backend.spring_boot_ecommerce.dto.Purchase;
import com.backend.spring_boot_ecommerce.dto.PurchaseResponse;
import com.backend.spring_boot_ecommerce.entity.Customer;
import com.backend.spring_boot_ecommerce.entity.OrderItem;
import com.backend.spring_boot_ecommerce.entity.Orders;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    public PurchaseResponse placeOrder(Purchase purchase) {
        //retrieve the order info from dto
        Orders order = purchase.getOrder();
        //generate tracking number
        String orderTrackingNumber = generateTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItemSet = purchase.getOrderItems();
        orderItemSet.forEach(order::add);

        //populate order with billingAdress And shippingAddress
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        //polpulate the customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        //save to the database
        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateTrackingNumber() {
        // generate a random UUID number
        return UUID.randomUUID().toString();
    }
}
