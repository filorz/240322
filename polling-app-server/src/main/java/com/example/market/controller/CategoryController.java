package com.example.market.controller;

import com.example.market.model.Category;
import com.example.market.payload.*;
import com.example.market.security.CurrentUser;
import com.example.market.security.UserPrincipal;
import com.example.market.service.CategoryService;
import com.example.market.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @PostMapping("/search")
    public PagedResponse<CategoryResponse> getProductsByCategoryId(@CurrentUser UserPrincipal currentUser,
                                                                   @RequestBody FilterRequest filterRequest) {

        return categoryService.getProductsByCategoryId(filterRequest, currentUser);
    }

    @PostMapping("/new")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryRequest categoryRequest) {
        Category category = categoryService.createCategory(categoryRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{categoryId}")
                .buildAndExpand(category.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Category Created Successfully"));
    }

    @GetMapping("/{categoryById}")
    public CategoryResponse getCategoryById(@PathVariable Long categoryById) {
        return categoryService.getCategoryById(categoryById);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllCategory() {
        List<Category> categories = categoryService.findAllCategories();
        return ResponseEntity.ok(categories);
    }
}
