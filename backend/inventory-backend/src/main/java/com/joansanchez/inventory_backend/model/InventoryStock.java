package com.joansanchez.inventory_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_stock", uniqueConstraints = {
    // Evita tener filas duplicadas para el mismo producto en el mismo almacén
    @UniqueConstraint(name = "uc_product_warehouse", columnNames = {"product_id", "warehouse_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Evita problemas de proxy en la serialización JSON
public class InventoryStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El producto es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER) // Cambiado a EAGER para asegurar la carga del producto al frontend
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "El almacén es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER) // Cambiado a EAGER para evitar LazyInitializationException fuera de sesión
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @NotNull(message = "La cantidad no puede ser nula")
    @PositiveOrZero(message = "El stock no puede ser negativo")
    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}