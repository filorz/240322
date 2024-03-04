package com.example.market.payload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String role;
    private List<ProductResponse> products;
}
