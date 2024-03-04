package com.example.market.payload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
@Getter
@Setter
@NoArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private Long price;
    private String description;
    private Long categoryId;
    private Instant creationDateTime;
}
