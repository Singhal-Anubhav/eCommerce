package com.backend.spring_boot_ecommerce.controller;

import com.backend.spring_boot_ecommerce.dto.Purchase;
import com.backend.spring_boot_ecommerce.dto.PurchaseResponse;
import com.backend.spring_boot_ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){

        return checkoutService.placeOrder(purchase);
    }
}
