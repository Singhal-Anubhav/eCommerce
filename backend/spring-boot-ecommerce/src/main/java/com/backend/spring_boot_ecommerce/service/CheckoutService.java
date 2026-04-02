package com.backend.spring_boot_ecommerce.service;

import com.backend.spring_boot_ecommerce.dto.Purchase;
import com.backend.spring_boot_ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
