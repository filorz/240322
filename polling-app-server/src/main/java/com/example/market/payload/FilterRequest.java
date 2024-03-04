package com.example.market.payload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class FilterRequest {
    private Long startPrice;
    private Long endPrice;
    private Long categoryId;
    private int page;
    private int size;
}
