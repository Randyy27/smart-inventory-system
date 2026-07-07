package com.joansanchez.inventory_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PriceSimulationRequest {
    private Long clientId;
    private Long productId;
}