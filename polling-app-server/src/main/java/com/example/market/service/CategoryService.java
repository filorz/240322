package com.example.market.service;

import com.example.market.exception.BadRequestException;
import com.example.market.exception.ResourceNotFoundException;
import com.example.market.model.Category;
import com.example.market.model.Product;
import com.example.market.payload.*;
import com.example.market.repository.CategoryRepository;
import com.example.market.repository.ProductRepository;
import com.example.market.repository.UserRepository;
import com.example.market.security.UserPrincipal;
import com.example.market.util.AppConstants;
import com.example.market.util.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    public PagedResponse<CategoryResponse> getProductsByCategoryId(FilterRequest filterRequest, UserPrincipal currentUser) {

        validatePageNumberAndSize(filterRequest.getPage(), filterRequest.getSize());

        Pageable pageable = PageRequest.of(0, 10, Sort.Direction.ASC, "createdAt");
        Pageable pageableProduct = PageRequest.of(filterRequest.getPage(), filterRequest.getSize(), Sort.Direction.ASC, "createdAt");
        Category category = categoryRepository.findAll(pageable).getContent().stream().findFirst().get();
        Page<Product> productPage;
        if (filterRequest.getEndPrice() > 0) {
            productPage = productRepository.findByPriceBetween(filterRequest.getStartPrice(), filterRequest.getEndPrice(), pageableProduct);
        } else {
            productPage = productRepository.findAllByCategoryId(
                    filterRequest.getCategoryId() == null || filterRequest.getCategoryId() == 0 ? category.getId() :
                            filterRequest.getCategoryId(), pageableProduct);
        }

        if(productPage.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), productPage.getNumber(),
                    productPage.getSize(), productPage.getTotalElements(), productPage.getTotalPages(), productPage.isLast());
        }

        CategoryResponse categoryResponse =
                ModelMapper.mapProductListToProductListResponse(productPage.getContent(), category, currentUser);

        return new PagedResponse<>(Collections.singletonList(categoryResponse), productPage.getNumber(),
                productPage.getSize(), productPage.getTotalElements(), productPage.getTotalPages(), productPage.isLast());
    }

    public Category createCategory(CategoryRequest pollRequest) {
        Category category = new Category();
        category.setName(pollRequest.getName());
        category.setDescription(pollRequest.getDescription());

        logger.info("Category with id {} Created Successfully", category.getId());
        return categoryRepository.save(category);
    }

    public CategoryResponse getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(
                () -> new ResourceNotFoundException("Category", "id", categoryId));

        return ModelMapper.mapCategoryToCategoryResponse(category);
    }

    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }
}
