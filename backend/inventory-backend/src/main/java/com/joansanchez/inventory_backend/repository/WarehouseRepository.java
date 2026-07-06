package com.joansanchez.inventory_backend.repository;

import com.joansanchez.inventory_backend.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    // Buscar almacén por su código único de negocio (Ej: WH-BCN-01)
    Optional<Warehouse> findByCode(String code);

    // Validar si el código ya existe antes de registrar uno nuevo
    boolean existsByCode(String code);
}