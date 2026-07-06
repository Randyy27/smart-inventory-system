package com.joansanchez.inventory_backend.controller;

import com.joansanchez.inventory_backend.model.InventoryStock;
import com.joansanchez.inventory_backend.service.InventoryStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class InventoryStockController {

    private final InventoryStockService stockService;

    public InventoryStockController(InventoryStockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<InventoryStock>> getStockByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(stockService.getStockByWarehouse(warehouseId));
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateStock(@RequestBody Map<String, Object> payload) {
        try {
            String sku = (String) payload.get("sku");
            String warehouseCode = (String) payload.get("warehouseCode");
            Integer quantity = (Integer) payload.get("quantity");

            if (sku == null || warehouseCode == null || quantity == null) {
                return ResponseEntity.badRequest().body("Faltan parámetros obligatorios: sku, warehouseCode o quantity");
            }

            InventoryStock updatedStock = stockService.updateStock(sku, warehouseCode, quantity);
            return ResponseEntity.ok(updatedStock);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}