# Delilah Restó

Este proyecto plantea la creación de un sistema de pedidos online para un restaurante. Donde se pone en funcionamiento las partes necesarias para montar una REST API que permita realizar altas, bajas, modificaciones y obtención de información sobre una estructura de datos que podría consumir un cliente. Parte del desafío está enfocado en lograr que el desarrollo del proyecto sea puesto en producción utilizando web services.

## Descripción general
Se trata de un backend para un sistema de pedidos online para un restaurante poniendo en funcionamiento las partes necesarias para montar una REST API que permita realizar operaciones CRUD sobre una estructura de datos.

El objetivo del proyecto Delilah Restó es emular la tarea de un desarrollador backend. Los entregables de mínima que se esperan son:

- Archivos JS
- Archivo SQL o instalación desde la aplicación
- Archivo de documentación
- README.md con instrucciones de instalación


## Get started

### Specifications

The specification for this API is in [Open API Docs](/spec.yaml).

You can see [Postman samples](https://documenter.getpostman.com/view/11310918/UzJFvdtB) as well.

### 1.- Clone the repository

```
$ git clone https://github.com/DaveSV100/delilah-resto.git
```

or you can also download it as a zip file.

### 2.- Install the dependencies

Use the following command

```
npm install
```

### 3.- Configure the Database

- Run a MYSQL server.

- Import the [queries folder](database/db-queries) into your graphic client like MySQL Workbench or Similar.

### 4.- Run the Server

Go to the [server folder](/server/) and run the following command:
```
node index.js
```
### 5.- Now it's ready to use 