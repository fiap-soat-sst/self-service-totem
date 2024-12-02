import 'reflect-metadata'
import 'dotenv/config'
import { DataSource } from 'typeorm'
import { Product } from './Models/Product'
import { Order } from './Models/Order'
import { OrderItem } from './Models/OrderItem'
import { CategoryEnum } from '../../Entities/Enums/CategoryEnum'
import { Transaction } from './Models/Transaction'
import dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    entities: [Product, Order, OrderItem, Transaction],
    migrations: [],
    synchronize: true,
})

AppDataSource.initialize()
    .then(async () => {
        console.log(
            '[MySql Database]: Connection has been established successfully 🚀'
        )

        // Inserir produtos após a criação da tabela
        const productRepository = AppDataSource.getRepository(Product)

        const existingProducts = await productRepository.count()
        if (existingProducts === 0) {
            const products = [
                {
                    name: 'Hambúrguer Clássico',
                    price: 15.5,
                    description:
                        'Pão, carne bovina, alface, tomate, queijo e maionese',
                    category: CategoryEnum.Sandwich,
                },
                {
                    name: 'Cheeseburger',
                    price: 11.9,
                    description:
                        'Pão, carne bovina, queijo cheddar, picles, cebola e ketchup',
                    category: CategoryEnum.Sandwich,
                },
                {
                    name: 'X-Bacon',
                    price: 20.0,
                    description:
                        'Pão, carne bovina, bacon, queijo, alface, tomate e maionese especial',
                    category: CategoryEnum.Sandwich,
                },
                {
                    name: 'Veggie Burger',
                    price: 18.65,
                    description:
                        'Pão integral, hambúrguer de grão-de-bico, alface, tomate, cenoura ralada e molho especial',
                    category: CategoryEnum.Sandwich,
                },
                {
                    name: 'Refrigerante Lata',
                    price: 5,
                    description:
                        'Diversos sabores de refrigerante em lata de 350ml.',
                    category: CategoryEnum.Drink,
                },
                {
                    name: 'Suco Natural',
                    price: 7.89,
                    description: 'Suco natural de laranja, limão ou maracujá.',
                    category: CategoryEnum.Drink,
                },
                {
                    name: 'Água Mineral',
                    price: 3.15,
                    description: 'Água mineral sem gás 500ml.',
                    category: CategoryEnum.Drink,
                },
                {
                    name: 'Batata Frita',
                    price: 8,
                    description: 'Porção de batata frita crocante.',
                    category: CategoryEnum.Side,
                },
                {
                    name: 'Onion Rings',
                    price: 10,
                    description: 'Anéis de cebola empanados e fritos.',
                    category: CategoryEnum.Side,
                },
                {
                    name: 'Nuggets de Frango',
                    price: 9,
                    description: 'Porção de nuggets de frango crocantes',
                    category: CategoryEnum.Side,
                },
                {
                    name: 'Sorvete',
                    price: 10,
                    description: 'Bola de sorvete com cobertura à escolha.',
                    category: CategoryEnum.Dessert,
                },
                {
                    name: 'Brownie',
                    price: 12,
                    description: 'Brownie de chocolate com nozes.',
                    category: CategoryEnum.Dessert,
                },
            ]

            await productRepository.save(products)
        }
    })
    .catch((error) => {
        throw error
    })
