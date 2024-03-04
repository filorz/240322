package com.example.market.util;

import com.example.market.model.Category;
import com.example.market.model.Product;
import com.example.market.payload.CategoryResponse;
import com.example.market.payload.ProductResponse;
import com.example.market.security.UserPrincipal;

import java.util.List;
import java.util.stream.Collectors;

public class ModelMapper {

    public static CategoryResponse mapCategoryToCategoryResponse(Category category) {
        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setId(category.getId());
        categoryResponse.setName(category.getName());
        categoryResponse.setDescription(category.getDescription());

        List<ProductResponse> productResponses = category.getProducts().stream().map(product -> {
            ProductResponse productResponse = new ProductResponse();
            productResponse.setId(product.getId());
            productResponse.setName(product.getName());
            productResponse.setDescription(product.getDescription());
            productResponse.setCategoryId(categoryResponse.getId());
            return productResponse;
        }).collect(Collectors.toList());
        categoryResponse.setProducts(productResponses);

        return categoryResponse;
    }
    public static CategoryResponse mapProductListToProductListResponse(List<Product> products, Category category, UserPrincipal currentUser) {
        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setId(category.getId());
        categoryResponse.setName(category.getName());
        categoryResponse.setDescription(category.getDescription());
        categoryResponse.setRole(currentUser.getAuthorities().stream().findFirst().get().toString());

        List<ProductResponse> productResponses = products.stream().map(product -> {
            ProductResponse productResponse = new ProductResponse();
            productResponse.setId(product.getId());
            productResponse.setCategoryId(categoryResponse.getId());
            productResponse.setName(product.getName());
            productResponse.setPrice(product.getPrice());
            productResponse.setDescription(product.getDescription());
            productResponse.setCreationDateTime(product.getCreatedAt());

            return productResponse;
        }).collect(Collectors.toList());
        categoryResponse.setProducts(productResponses);

        return categoryResponse;
    }

}
