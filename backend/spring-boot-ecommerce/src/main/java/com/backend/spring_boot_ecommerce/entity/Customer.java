package com.backend.spring_boot_ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.query.Order;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String email;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<Orders> orders = new HashSet<>();

    public void add(Orders order){

        if(orders == null){
            orders = new HashSet<>();
        }

        orders.add(order);
        order.setCustomer(this);
    }

}
