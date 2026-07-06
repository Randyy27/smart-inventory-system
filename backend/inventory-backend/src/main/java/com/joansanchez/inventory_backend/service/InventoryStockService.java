package com.joansanchez.inventory_backend.service;

import com.joansanchez.inventory_backend.model.InventoryStock;
import com.joansanchez.inventory_backend.model.Product;
import com.joansanchez.inventory_backend.model.Warehouse;
import com.joansanchez.inventory_backend.repository.InventoryStockRepository;
import com.joansanchez.inventory_backend.repository.ProductRepository;
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

    public InventoryStockService(InventoryStockRepository stockRepository, 
                                 ProductRepository productRepository, 
                                 WarehouseRepository warehouseRepository) {
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryStock> getStockByWarehouse(Long warehouseId) {
        return stockRepository.findByWarehouseId(warehouseId);
    }

    @Transactional
    public InventoryStock updateStock(String sku, String warehouseCode, Integer quantity) {
        // 1. Validar que el producto exista
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new IllegalArgumentException("No existe el producto con SKU: " + sku));

        // 2. Validar que el almacén exista
        Warehouse warehouse = warehouseRepository.findByCode(warehouseCode)
                .orElseThrow(() -> new IllegalArgumentException("No existe el almacén con código: " + warehouseCode));

        // 3. Buscar si ya existe una combinación de stock previa
        Optional<InventoryStock> existingStock = stockRepository.findByProductIdAndWarehouseId(product.getId(), warehouse.getId());

        if (existingStock.isPresent()) {
            InventoryStock stock = existingStock.get();
            int newQuantity = stock.getQuantity() + quantity;
            if (newQuantity < 0) {
                throw new IllegalArgumentException("El stock resultante no puede ser negativo");
            }
            stock.setQuantity(newQuantity);
            return stockRepository.save(stock);
        } else {
            if (quantity < 0) {
                throw new IllegalArgumentException("No se puede inicializar un stock con valores negativos");
            }
            InventoryStock newStock = InventoryStock.builder()
                    .product(product)
                    .warehouse(warehouse)
                    .quantity(quantity)
                    .build();
            return stockRepository.save(newStock);
        }
    }
}