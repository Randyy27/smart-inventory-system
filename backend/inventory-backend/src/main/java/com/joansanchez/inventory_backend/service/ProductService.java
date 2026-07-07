package com.joansanchez.inventory_backend.service;

import com.joansanchez.inventory_backend.model.Product;
import com.joansanchez.inventory_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    // Inyección de dependencias por constructor
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Product> getProductBySku(String sku) {
        return productRepository.findBySku(sku);
    }

    @Transactional
    public Product createProduct(Product product) {
        // Validar que el SKU no esté duplicado
        if (productRepository.existsBySku(product.getSku())) {
            throw new IllegalArgumentException("Ya existe un producto con el SKU: " + product.getSku());
        }
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("No se puede eliminar. No existe el producto con ID: " + id);
        }
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, Product productDetails) {
    return productRepository.findById(id)
            .map(product -> {
                product.setSku(productDetails.getSku());
                product.setName(productDetails.getName());
                product.setPrice(productDetails.getPrice());
                // Conservar o mapear otros campos si tu modelo los requiere (como description o category)
                return productRepository.save(product);
            })
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));
}
}