package com.example.market.controller;

import com.example.market.model.Category;
import com.example.market.model.Product;
import com.example.market.payload.*;
import com.example.market.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest productRequest) {
        Product product = productService.createProduct(productRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/")
                .buildAndExpand(product.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Product Created Successfully"));
    }

    @GetMapping("/update/{productId}")
    public ResponseEntity<?> updateCategoryById(@PathVariable Long productId) {
        Product product = productService.updateCategory(productId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/")
                .buildAndExpand(product.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Product Update Successfully"));
    }

    @PostMapping("/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@RequestParam(value = "productId") Long productId) {
        productService.deleteProduct(productId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/")
                .buildAndExpand(productId).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Product Delete Successfully"));
    }
}
