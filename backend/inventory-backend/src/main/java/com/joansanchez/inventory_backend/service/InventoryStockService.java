package com.joansanchez.inventory_backend.service;

import com.joansanchez.inventory_backend.model.InventoryStock;
import com.joansanchez.inventory_backend.model.MovementType;
import com.joansanchez.inventory_backend.model.Product;
import com.joansanchez.inventory_backend.model.StockMovement;
import com.joansanchez.inventory_backend.model.Warehouse;
import com.joansanchez.inventory_backend.repository.InventoryStockRepository;
import com.joansanchez.inventory_backend.repository.ProductRepository;
import com.joansanchez.inventory_backend.repository.StockMovementRepository;
import com.joansanchez.inventory_backend.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryStockService {

    private final InventoryStockRepository stockRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockMovementRepository stockMovementRepository;

    public InventoryStockService(InventoryStockRepository stockRepository, 
                                 ProductRepository productRepository, 
                                 WarehouseRepository warehouseRepository,
                                 StockMovementRepository stockMovementRepository) {
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryStock> getAllStocks() {
        return stockRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<InventoryStock> getStockByWarehouseId(Long warehouseId) {
        return stockRepository.findByWarehouseId(warehouseId);
    }

    /**
     * Actualiza o inicializa el stock de un producto en un almacén.
     * La anotación @Transactional asegura que si falla la escritura del movimiento
     * de auditoría, se revierta el cambio en la tabla de existencias (Rollback).
     */
    @Transactional(rollbackFor = Exception.class)
    public InventoryStock updateStock(String sku, String warehouseCode, int quantity) {
        Product product = productRepository.findBySku(sku.trim())
                .orElseThrow(() -> new IllegalArgumentException("No existe el producto con SKU: " + sku));

        Warehouse warehouse = warehouseRepository.findByCode(warehouseCode.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("No existe el almacén con código: " + warehouseCode));

        Optional<InventoryStock> existingStock = stockRepository.findByProductIdAndWarehouseId(product.getId(), warehouse.getId());

        int deltaQuantity;
        InventoryStock savedStock;

        if (existingStock.isPresent()) {
            InventoryStock stock = existingStock.get();
            
            // Calculamos la diferencia (Nueva cantidad - Cantidad que había antes)
            deltaQuantity = quantity - stock.getQuantity();
            
            stock.setQuantity(quantity);
            savedStock = stockRepository.save(stock);
        } else {
            // Si no existía, la diferencia es la cantidad completa que se inicializa
            deltaQuantity = quantity;
            
            InventoryStock newStock = InventoryStock.builder()
                    .product(product)
                    .warehouse(warehouse)
                    .quantity(quantity)
                    .build();
            savedStock = stockRepository.save(newStock);
        }

        // AUDITORÍA: Solo guardamos movimiento si realmente ha variado la cantidad
        if (deltaQuantity != 0) {
            // Si el ajuste es negativo, se podría tipar como SALIDA si tu frontend o negocio lo requiere, 
            // de momento mantenemos tu estructura con MovementType.AJUSTE
            StockMovement movement = StockMovement.builder()
                    .product(product)
                    .warehouse(warehouse)
                    .movementType(MovementType.AJUSTE) 
                    .quantity(deltaQuantity)
                    .build();
            stockMovementRepository.save(movement);
        }

        return savedStock;
    }
}