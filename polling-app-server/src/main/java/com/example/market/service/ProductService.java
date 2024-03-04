package com.example.market.service;

import com.example.market.model.Product;
import com.example.market.payload.ProductRequest;
import com.example.market.repository.CategoryRepository;
import com.example.market.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public Product createProduct(ProductRequest productRequest) {
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setCategoryId(productRequest.getCategoryId());

        return productRepository.save(product);
    }

    public Product updateCategory(Long productId) {
        return new Product();
    }

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
}
