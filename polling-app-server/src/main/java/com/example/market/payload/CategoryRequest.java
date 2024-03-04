package com.example.market.payload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CategoryRequest {
    private Long id;
    private String name;
    private String description;
}
