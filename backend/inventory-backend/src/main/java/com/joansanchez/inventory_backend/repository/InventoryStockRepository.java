package com.joansanchez.inventory_backend.repository;

import com.joansanchez.inventory_backend.model.InventoryStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryStockRepository extends JpaRepository<InventoryStock, Long> {

    // Buscar el registro de stock específico de un producto en un almacén concreto
    Optional<InventoryStock> findByProductIdAndWarehouseId(Long productId, Long warehouseId);

    // Obtener todo el stock de un almacén
    List<InventoryStock> findByWarehouseId(Long warehouseId);

    // Obtener en qué almacenes está repartido un producto concreto
    List<InventoryStock> findByProductId(Long productId);
}