package com.joansanchez.inventory_backend.service;

import com.joansanchez.inventory_backend.model.Warehouse;
import com.joansanchez.inventory_backend.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    // Inyección por constructor reglamentaria
    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    @Transactional(readOnly = true)
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Warehouse> getWarehouseByCode(String code) {
        return warehouseRepository.findByCode(code);
    }

    @Transactional
    public Warehouse createWarehouse(Warehouse warehouse) {
        // Impedir almacenes con códigos duplicados
        if (warehouseRepository.existsByCode(warehouse.getCode())) {
            throw new IllegalArgumentException("Ya existe un almacén con el código: " + warehouse.getCode());
        }
        return warehouseRepository.save(warehouse);
    }

    @Transactional
    public void deleteWarehouse(Long id) {
        if (!warehouseRepository.existsById(id)) {
            throw new IllegalArgumentException("No se puede eliminar. No existe el almacén con ID: " + id);
        }
        warehouseRepository.deleteById(id);
    }
}