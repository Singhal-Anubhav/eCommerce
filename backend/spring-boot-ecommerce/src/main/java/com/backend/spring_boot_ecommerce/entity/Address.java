package com.backend.spring_boot_ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String street;

        private String city;

        private String state;

        private String country;

        @Column(name = "zip_code")
        private String zipCode;

        @OneToOne(cascade = CascadeType.ALL)
        @PrimaryKeyJoinColumn
        private Orders order;

}
