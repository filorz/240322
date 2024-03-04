package com.example.market.payload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProductRequest {
    private String name;
    private String description;
    private Long price;
    private Long categoryId;
    private Instant creationDateTime;
}
