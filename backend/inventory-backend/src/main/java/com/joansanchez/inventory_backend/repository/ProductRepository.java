package com.joansanchez.inventory_backend.repository;

import com.joansanchez.inventory_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Spring Data JPA genera automáticamente la query SQL al leer el nombre del método
    Optional<Product> findBySku(String sku);

    // Comprobar si un SKU ya existe antes de crearlo para evitar colisiones
    boolean existsBySku(String sku);
}