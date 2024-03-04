package com.example.market.repository;

import com.example.market.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findAllByCategoryId(Long price, Pageable pageable);
    Page<Product> findByPriceBetween(Long startPrice, Long endPrice, Pageable pageable);

}
