package com.joansanchez.inventory_backend.service;

import com.joansanchez.inventory_backend.model.ClientType;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PriceService {

    /**
     * Calcula el precio final de un producto aplicando el descuento asignado a la tarifa del cliente.
     * - ESTANDAR: 0% descuento (Precio catálogo)
     * - SOCIO: 10% descuento
     * - UNIVERSIDAD: 20% descuento
     */
    public double calculateCustomPrice(double basePrice, ClientType clientType) {
        if (clientType == null) {
            return basePrice;
        }

        double discountPercentage = 0.0;

        switch (clientType) {
            case SOCIO:
                discountPercentage = 0.10;
                break;
            case UNIVERSIDAD:
                discountPercentage = 0.20;
                break;
            case ESTANDAR:
            default:
                discountPercentage = 0.0;
                break;
        }

        double finalPrice = basePrice * (1.0 - discountPercentage);
        
        // Redondear a 2 decimales
        return BigDecimal.valueOf(finalPrice)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }
}