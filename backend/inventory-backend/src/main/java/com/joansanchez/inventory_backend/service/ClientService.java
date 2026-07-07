package com.joansanchez.inventory_backend.service;

import com.joansanchez.inventory_backend.model.Client;
import com.joansanchez.inventory_backend.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Transactional(readOnly = true)
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Transactional
    public Client saveClient(Client client) {
        if (client.getEmail() != null && !client.getEmail().isBlank()) {
            clientRepository.findByEmail(client.getEmail().trim())
                    .ifPresent(c -> {
                        throw new IllegalArgumentException("Ya existe un cliente registrado con el email: " + client.getEmail());
                    });
        }
        return clientRepository.save(client);
    }

    @Transactional
    public Client updateClient(Long id, Client clientDetails) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No existe el cliente con ID: " + id));

        // Validar email si cambia
        if (clientDetails.getEmail() != null && !clientDetails.getEmail().equalsIgnoreCase(client.getEmail())) {
            clientRepository.findByEmail(clientDetails.getEmail().trim())
                    .ifPresent(c -> {
                        throw new IllegalArgumentException("El email ya está en uso por otro cliente: " + clientDetails.getEmail());
                    });
        }

        client.setName(clientDetails.getName().trim());
        client.setEmail(clientDetails.getEmail() != null ? clientDetails.getEmail().trim() : null);
        client.setPhone(clientDetails.getPhone() != null ? clientDetails.getPhone().trim() : null);
        client.setClientType(clientDetails.getClientType());

        return clientRepository.save(client);
    }

    @Transactional
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new IllegalArgumentException("No se puede eliminar. No existe el cliente con ID: " + id);
        }
        clientRepository.deleteById(id);
    }
}