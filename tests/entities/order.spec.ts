import Order from '../../src/Entities/Order'
import OrderItem from '../../src/Entities/OrderItem'
import { StatusEnum } from '../../src/Entities/Enums/StatusEnum'
import Product from '../../src/Entities/Product'

import { CategoryEnum } from '../../src/Entities/Enums/CategoryEnum'

import StatusOrderException from '../../src/@Shared/StatusOrderException'
import { createMockProduct } from '../mocks/product.mock'
import OrderWithOutProductsException from '../../src/@Shared/OrderWithOutProductsException'
import InvalidCustomerException from '../../src/@Shared/InvalidCustomerException'
import Customer from '../../src/Entities/Customer'

describe('Order entity', () => {
    let order: Order
    let customer: Customer

    beforeEach(() => {
        customer = new Customer('John Doe', '76176752086')
        order = new Order(customer)
    })

    it('should create and return an order', () => {
        const orderItem = new OrderItem(createMockProduct(), 1)
        order.addItem(orderItem)

        expect(order.toJSON()).toEqual({
            id: order.getId(),
            closed: order.isClosed(),
            createdAt: order.getCreatedAt(),
            customer: order.getCustomer(),
            items: order.getItems().map((item) => item.toJSON()),
            status: order.getStatus(),
            total: order.getTotalOrderValue(),
        })
    })

    it('should create a new order', () => {
        expect(order).toBeInstanceOf(Order)
        expect(order.getCustomer()).toEqual({
            name: 'John Doe',
            cpf: { cpf: '76176752086' },
        })
        expect(order.getStatus()).toBe(StatusEnum.Received)
        expect(order.getCreatedAt()).toBeInstanceOf(Date)
        expect(order.isClosed()).toBe(false)
        expect(order.getItems().length).toBe(0)
        expect(order.getId()).toBeNull()
    })

    it('should add an item to the order', () => {
        const orderItem = new OrderItem(createMockProduct(), 1)
        order.addItem(orderItem)

        expect(order.getItems()).toEqual([orderItem])
    })

    it('should clear all items from the order', () => {
        order.addItem(new OrderItem(createMockProduct(), 1))
        order.clearItems()

        expect(order.getItems().length).toBe(0)
    })

    it('should add products to the order', () => {
        const product = createMockProduct()
        order.addProduct(product, 1)
        order.addProduct(product, 3)
        const newProduct = createMockProduct()
        order.addProduct(newProduct, 5)

        expect(order.getItems()[0].getQuantity()).toBe(4)
        expect(order.getItems()[0].getProduct()).toBe(product)
        expect(order.getItems()[1].getQuantity()).toBe(5)
        expect(order.getItems()[1].getProduct()).toBe(newProduct)
    })

    it('should update products in the order', () => {
        const product = createMockProduct()
        order.addProduct(product, 1)
        order.updateProduct(product, 2)

        expect(order.getItems()[0].getQuantity()).toBe(2)
    })

    it('should remove an item from the order', () => {
        const product = createMockProduct()
        const orderItem = new OrderItem(product, 1)
        order.addItem(orderItem)
        order.removeProduct(product)

        expect(order.getItems().length).toBe(0)
    })

    it('should set the status for the order', () => {
        order.updateStatus(StatusEnum.Preparing)

        expect(order.getStatus()).toBe(StatusEnum.Preparing)
    })

    it('should throw an error if the status is invalid', () => {
        expect(() => {
            order.updateStatus(StatusEnum.Preparing)
            order.updateStatus(StatusEnum.Preparing)
        }).toThrow(StatusOrderException)
        expect(() => {
            order.updateStatus(StatusEnum.Received)
            order.updateStatus(StatusEnum.Ready)
        }).toThrow(StatusOrderException)
        expect(() => {
            order.updateStatus(StatusEnum.Finished)
        }).toThrow(StatusOrderException)
    })

    it('should throw an error if the order is empty', () => {
        expect(() => {
            order.addProduct(createMockProduct(), 0)
        }).toThrow()
    })

    it('should throw an error if the order is closed', () => {
        expect(() => {
            order.closeOrder()
        }).toThrow()
    })

    it('should throw an error on create if the status != Received', () => {
        const customer = new Customer('John Doe', '76176752086')
        expect(() => {
            new Order(customer, null, StatusEnum.Preparing)
        }).toThrow(StatusOrderException)
    })

    it('changing products of the order', () => {
        const chocolate = new Product(
            '1',
            'Chocolate',
            CategoryEnum.Drink,
            10,
            'Chocolate amargo'
        )

        const pudim = new Product(
            '2',
            'Pudim',
            CategoryEnum.Sandwich,
            15,
            'Pudim de leite condensado'
        )

        order.addProduct(chocolate, 1)
        expect(order.getItems().length).toBe(1)

        order.addProduct(pudim, 1)
        expect(order.getItems().length).toBe(2)

        order.updateProduct(chocolate, 2)
        expect(order.getItems().length).toBe(2)

        order.addProduct(pudim, 1)
        expect(order.getItems().length).toBe(2)

        order.clearItems()
        expect(order.getItems().length).toBe(0)
    })

    it('should return an object', () => {
        const product = new Product(
            '1',
            'Hamburguer Classic',
            CategoryEnum.Sandwich,
            10,
            'Muito suculento'
        )
        const customer = new Customer('John Doe', '76176752086')
        const orderItem = new OrderItem(product, 1)

        const order = new Order(
            customer,
            '123456789',
            StatusEnum.Received,
            new Date()
        )

        order.addItem(orderItem)
        expect(order.toJSON()).toEqual({
            id: expect.any(String),
            items: [orderItem.toJSON()],
            customer: {
                name: 'John Doe',
                cpf: { cpf: '76176752086' },
            },
            status: StatusEnum.Received,
            closed: false,
            total: 10,
            createdAt: expect.any(Date),
        })
    })

    it('should closed the order', () => {
        const product = new Product(
            '1',
            'Hamburguer Classic',
            CategoryEnum.Sandwich,
            10,
            'Muito suculento'
        )
        const orderItem = new OrderItem(product, 1)
        order.addItem(orderItem)

        order.closeOrder()
        expect(order.isClosed()).toBe(true)
    })

    it('should throw an error if the order status changes to ready without being ready', () => {
        expect(() => {
            order.updateStatus(StatusEnum.Ready)
        }).toThrow(StatusOrderException)
    })

    it('should throw an error if the order status changes to finished without being ready', () => {
        expect(() => {
            order.updateStatus(StatusEnum.Finished)
        }).toThrow(StatusOrderException)
    })

    it('should throw an error if the order was closed without order items', () => {
        expect(() => {
            order.closeOrder()
        }).toThrow(OrderWithOutProductsException)
    })
})
