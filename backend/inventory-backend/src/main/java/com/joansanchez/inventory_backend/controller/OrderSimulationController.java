package com.joansanchez.inventory_backend.controller;

import com.joansanchez.inventory_backend.dto.PriceSimulationRequest;
import com.joansanchez.inventory_backend.dto.PriceSimulationResponse;
import com.joansanchez.inventory_backend.dto.OrderConfirmationRequest;
import com.joansanchez.inventory_backend.model.*;
import com.joansanchez.inventory_backend.repository.*;
import com.joansanchez.inventory_backend.service.PriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderSimulationController {

    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryStockRepository inventoryStockRepository;
    private final StockMovementRepository stockMovementRepository;
    private final PriceService priceService;

    public OrderSimulationController(ClientRepository clientRepository, 
                                     ProductRepository productRepository,
                                     WarehouseRepository warehouseRepository,
                                     InventoryStockRepository inventoryStockRepository,
                                     StockMovementRepository stockMovementRepository,
                                     PriceService priceService) {
        this.clientRepository = clientRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryStockRepository = inventoryStockRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.priceService = priceService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<?> simulatePrice(@RequestBody PriceSimulationRequest request) {
        if (request.getClientId() == null || request.getProductId() == null) {
            return ResponseEntity.badRequest().body("El ID del cliente y del producto son obligatorios.");
        }

        Client client = clientRepository.findById(request.getClientId()).orElse(null);
        Product product = productRepository.findById(request.getProductId()).orElse(null);

        if (client == null) return ResponseEntity.badRequest().body("Cliente no encontrado.");
        if (product == null) return ResponseEntity.badRequest().body("Producto no encontrado.");

        double basePrice = product.getPrice() != null ? product.getPrice().doubleValue() : 0.0;
        double finalPrice = priceService.calculateCustomPrice(basePrice, client.getClientType());
        double discountApplied = basePrice - finalPrice;

        PriceSimulationResponse response = PriceSimulationResponse.builder()
                .clientName(client.getName())
                .clientType(client.getClientType())
                .productName(product.getName())
                .sku(product.getSku())
                .basePrice(basePrice)
                .discountApplied(discountApplied)
                .finalPrice(finalPrice)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm")
    @Transactional
    public ResponseEntity<?> confirmOrder(@RequestBody OrderConfirmationRequest request) {
        if (request.getClientId() == null || request.getProductId() == null || 
            request.getWarehouseId() == null || request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Todos los campos son obligatorios y la cantidad debe ser mayor que cero.");
        }

        Client client = clientRepository.findById(request.getClientId()).orElse(null);
        Product product = productRepository.findById(request.getProductId()).orElse(null);
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId()).orElse(null);

        if (client == null) return ResponseEntity.badRequest().body("Cliente no encontrado.");
        if (product == null) return ResponseEntity.badRequest().body("Producto no encontrado.");
        if (warehouse == null) return ResponseEntity.badRequest().body("Almacén no encontrado.");

        InventoryStock stock = inventoryStockRepository.findByProductIdAndWarehouseId(product.getId(), warehouse.getId()).orElse(null);

        if (stock == null || stock.getQuantity() < request.getQuantity()) {
            int disponible = stock == null ? 0 : stock.getQuantity();
            return ResponseEntity.badRequest().body("Stock insuficiente en el almacén " + warehouse.getCode() + 
                    ". Solicitado: " + request.getQuantity() + " uds. Disponible: " + disponible + " uds.");
        }

        // 1. Descontar las unidades físicas del Stock
        stock.setQuantity(stock.getQuantity() - request.getQuantity());
        inventoryStockRepository.save(stock);

        // 2. Generar el registro inmutable en la auditoría (Kárdex)
        StockMovement movement = new StockMovement();
        movement.setWarehouse(warehouse);
        movement.setProduct(product);
        movement.setQuantity(-request.getQuantity()); 
        
        movement.setMovementType(MovementType.SALIDA); 
        
        movement.setCreatedAt(LocalDateTime.now());
        stockMovementRepository.save(movement);

        return ResponseEntity.ok("Pedido procesado con éxito. Se ha registrado la salida de mercancía.");
    }
}