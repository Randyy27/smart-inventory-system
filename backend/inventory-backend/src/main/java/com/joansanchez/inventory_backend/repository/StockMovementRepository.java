package com.joansanchez.inventory_backend.repository;

import com.joansanchez.inventory_backend.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    // Esto nos servirá más adelante para listar el historial de un almacén concreto
    List<StockMovement> findByWarehouseIdOrderByCreatedAtDesc(Long warehouseId);
}