package com.joansanchez.inventory_backend.dto;

import com.joansanchez.inventory_backend.model.ClientType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PriceSimulationResponse {
    private String clientName;
    private ClientType clientType;
    private String productName;
    private String sku;
    private double basePrice;
    private double discountApplied;
    private double finalPrice;
}