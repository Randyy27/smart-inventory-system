package com.joansanchez.inventory_backend.repository;

import com.joansanchez.inventory_backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    // Para evitar registrar dos clientes con el mismo correo electrónico
    Optional<Client> findByEmail(String email);
}