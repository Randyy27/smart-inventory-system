# Smart Inventory & Logistics System 

![Status](https://img.shields.io/badge/Status-Completed-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## Autor
**Joan Sánchez Ballesteros** *Ingeniería Informática - UAB* | [LinkedIn](https://www.linkedin.com/in/joan-sanchez-ballesteros-8024b7368/) | [GitHub](https://github.com/Randyy27)

## Descripción del Proyecto
Sistema de gestión de inventario profesional diseñado para el control de stock, auditoría inmutable de movimientos (Kárdex) y simulación de operaciones logísticas. El sistema garantiza la integridad de los datos mediante transacciones robustas y permite la exportación de informes para auditoría.

## Tecnologías Principales
* **Backend:** Java 17+, Spring Boot 3.x, Spring Data JPA.
* **Frontend:** React, Tailwind CSS.
* **Base de Datos:** PostgreSQL.
* **Infraestructura:** Docker & Docker Compose.
* **Formato de datos:** CSV (Exportación de auditoría).

## Características Clave
- **Transaccionalidad:** Operaciones de stock protegidas con `@Transactional` para evitar descuadres.
- **Kárdex Inmutable:** Registro histórico detallado de entradas, salidas y ajustes.
- **Exportación:** Generación automática de informes en formato CSV para Excel.
- **Arquitectura:** Separación clara entre lógica de negocio, persistencia y vistas.

## Instalación y Ejecución
1. Clona el repositorio
2. docker-compose up -d
3. Ejecutar el Backend:
Asegúrate de configurar las variables de entorno para conectar con PostgreSQL (puerto 5432) y lanza la aplicación desde tu IDE o terminal con:
./mvnw spring-boot:run
4. Ejecutar el Frontend:
cd frontend
npm install
npm run dev
**El sistema estará disponible en http://localhost:5173.**