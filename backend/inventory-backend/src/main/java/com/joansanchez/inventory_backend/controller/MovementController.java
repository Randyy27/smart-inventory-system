package com.joansanchez.inventory_backend.controller;

import com.joansanchez.inventory_backend.model.StockMovement;
import com.joansanchez.inventory_backend.repository.StockMovementRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin(origins = "http://localhost:5173")
public class MovementController {

    private final StockMovementRepository movementRepository;

    public MovementController(StockMovementRepository movementRepository) {
        this.movementRepository = movementRepository;
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportKardexToCSV() {
        List<StockMovement> movements = movementRepository.findAll();

        StringWriter writer = new StringWriter();
        writer.append("\uFEFF"); // BOM para compatibilidad con Excel
        writer.append("Fecha,SKU,Producto,Almacen,Operacion,Cantidad\n");

        for (StockMovement m : movements) {
            writer.append(m.getCreatedAt() != null ? m.getCreatedAt().toString() : "").append(",")
                  .append(m.getProduct() != null ? m.getProduct().getSku() : "N/A").append(",")
                  .append(m.getProduct() != null ? m.getProduct().getName().replace(",", " ") : "N/A").append(",")
                  .append(m.getWarehouse() != null ? m.getWarehouse().getCode() : "N/A").append(",")
                  .append(m.getMovementType() != null ? m.getMovementType().name() : "N/A").append(",")
                  .append(String.valueOf(m.getQuantity())).append("\n");
        }

        byte[] csvBytes = writer.toString().getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=informe_kardex.csv");
        headers.add(HttpHeaders.CONTENT_TYPE, "text/csv; charset=utf-8");

        return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
    }
}