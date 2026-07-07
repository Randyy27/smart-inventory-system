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
Sigue estos pasos para poner en marcha el sistema en tu entorno local:
( REQUISITOS PREVIOS: docker desktop, git, Java 17, Node.js)
### 1. Clonación del Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Infraestructura (Docker)
Levanta la base de datos PostgreSQL utilizando Docker Compose:
```bash
docker-compose up -d
```

### 3. Configuración del Backend
Asegúrate de que tus variables de entorno estén configuradas para conectar con PostgreSQL (puerto `5432`). Una vez configurado, inicia el servidor:
```bash
./mvnw spring-boot:run
```

### 4. Configuración del Frontend
En una nueva terminal, navega a la carpeta del cliente e inicia la interfaz:
```bash
cd frontend
npm install
npm run dev
```

> **Nota:** Una vez completados los pasos, podrás acceder al sistema a través de tu navegador en: [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173).
