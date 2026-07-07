package com.joansanchez.inventory_backend.controller;

import com.joansanchez.inventory_backend.model.StockMovement;
import com.joansanchez.inventory_backend.service.InventoryStockService; // Si tienes la búsqueda aquí, o creas un método en el servicio dedicado.
import com.joansanchez.inventory_backend.repository.StockMovementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin(origins = "*")
public class StockMovementController {

    private final StockMovementRepository stockMovementRepository;

    public StockMovementController(StockMovementRepository stockMovementRepository) {
        this.stockMovementRepository = stockMovementRepository;
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<StockMovement>> getMovementsByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(stockMovementRepository.findByWarehouseIdOrderByCreatedAtDesc(warehouseId));
    }
}