# SELF SERVICE TOTEM

<img alt="Node Version" src="https://img.shields.io/badge/Node_Version-20.18-green"> [![Setup and build](https://github.com/fiap-soat-sst/self-service-totem/actions/workflows/setup-build-pipeline.yml/badge.svg)](https://github.com/fiap-soat-sst/self-service-totem/actions/workflows/setup-build-pipeline.yml) ![coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/evilfeeh/b08eb2c7df611955dd487f17d2a4c340/raw/coverage.json) <img src="https://img.shields.io/github/v/release/fiap-soat-sst/self-service-totem?display_name=tag&label=Release%20Version"> 


This Project about Tech Challenge from FIAP
A monolith backend Developed with TypeScript, Docker, DDD, and hexagonal architecture.

## ABOUT

We're introducing a Software that aims to optimize the self-service process in fast-food restaurants. Through an interactive totem, customers can place their orders quickly, conveniently, and autonomously, reducing queues and speeding up service.

Our **Event Storming** can be found here: https://miro.com/app/board/uXjVKVP2yDY=/

For more details about the project, access: https://github.com/evilfeeh/self-service-totem

## POSTGRADUATION PHASES

As these projects are being built due to the FIAP postgraduation, we use the [github wiki](https://github.com/evilfeeh/self-service-totem/wiki) to document the details of each phase and also provide more information if necessary.

## FEATURES

-   Customer:
    -   [x] Register a new customer
    -   [x] identify a customer by their CPF
-   Product:
    -   [x] Create, update, and delete a product
    -   [x] Find a product by category
-   Orders:
    -   [x] Register a new order
    -   [x] Simulate checkout process (fake checkout)
    -   [x] List orders

## ubiquitous Language Dictionary

-   Cliente (Customer): The person who will consume the order
-   Pedido (Order): The order with all customer's Items
-   Cozinha (Kitchen): Team preparing the items of order
-   Pagamento (Payment): Process to pay the order
-   Lanche, Acompanhamento, Bebida, Sobremesa: Items available on the menu

## PREREQUISITES

  <img alt="Docker" src="https://img.shields.io/badge/Docker-latest">

## HOW TO SETUP:

Clone the project repository:

```bash
git clone https://github.com/evilfeeh/self-service-totem.git
```

Access the project directory:

```bash
cd self-service-totem
```

Run the application with Docker Compose:

```bash
docker compose up
```

The app runs into port 3000, it's possible to change the value port or other environments inside a .env file

To access the docs, access:
`http://localhost:3000/public/docs`

## Accessing the API

After running everything, you can use the `Kubectl` commands to ensure the initialization's pod.
To access the Swagger application is required to port forwarding the API.

Specify the API's pod name and run:

```bash
kubectl port-forward <api-pod-name> 3000:3000
```
# Coverage - taken from the last Pull Request
![image](https://github.com/user-attachments/assets/08d8dacd-763b-4bb6-b916-191a8060887e)



# PHASE 3 DATABASE JUSTIFICATION

The Self Service Totem project uses MySQL RDS for storing Product, Payment, and Order data due to the need for transactional consistency and complex relationships between these entities, which relational databases handle well. DynamoDB is used to store user information, leveraging its high scalability and low latency for frequent queries and fast access. Security is enhanced through a Lambda Authorizer integrated with API Gateway for efficient access control within the serverless architecture.

## RDS MySql

![MER BANDO DE DADOS](./diagrams/mer-database.png)

## DynamoDB

![MER BANDO DE DADOS](./diagrams/mer-auth-database.png)
