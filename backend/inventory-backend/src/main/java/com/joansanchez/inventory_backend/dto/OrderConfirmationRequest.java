package com.joansanchez.inventory_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderConfirmationRequest {
    private Long clientId;
    private Long productId;
    private Long warehouseId;
    private int quantity;
}