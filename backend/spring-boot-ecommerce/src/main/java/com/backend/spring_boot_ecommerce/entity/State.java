package com.backend.spring_boot_ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity()
@Data()
@Table(name = "state")
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;
}
