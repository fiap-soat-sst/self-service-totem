import { describe, it, beforeEach, expect, vi } from 'vitest'
import { isLeft, isRight, Left, Right } from '../../../src/@Shared/Either'
import IExternalPaymentGatewayRepository from '../../../src/Gateways/contracts/IExternalPaymentGatewayRepository'
import { IOrderGatewayRepository } from '../../../src/Gateways/contracts/IOrderGatewayRepository'
import { ITransactionGatewayRepository } from '../../../src/Gateways/contracts/ITransactionGatewayRepository'
import CheckoutUseCase from '../../../src/UseCases/Payment/checkout/checkout.usecase'
import { InputCheckoutDTO } from '../../../src/UseCases/Payment/checkout/checkout.dto'
import { randomUUID } from 'crypto'
import Order from '../../../src/Entities/Order'
import Customer from '../../../src/Entities/Customer'
import Product from '../../../src/Entities/Product'

const ORDER_ID = randomUUID()

describe('CheckoutUseCase', () => {
    let usecase: CheckoutUseCase
    let mockOrderRepository: IOrderGatewayRepository
    let mockExternalPaymentRepository: IExternalPaymentGatewayRepository
    let mockTransactionRepository: ITransactionGatewayRepository

    beforeEach(() => {
        mockOrderRepository = {
            get: vi.fn(),
        } as unknown as IOrderGatewayRepository
        mockExternalPaymentRepository = {
            checkout: vi.fn(),
            getPaymentStatusById: vi.fn(),
        } as unknown as IExternalPaymentGatewayRepository
        mockTransactionRepository = {
            save: vi.fn(),
        } as unknown as ITransactionGatewayRepository
        usecase = new CheckoutUseCase(
            mockOrderRepository,
            mockExternalPaymentRepository,
            mockTransactionRepository
        )
    })

    it('should return an error if order retrieval fails', async () => {
        const input: InputCheckoutDTO = {
            orderId: ORDER_ID,
            token: 'valid-token',
        }
        vi.spyOn(mockOrderRepository, 'get').mockResolvedValue(
            Left(new Error('Order not found'))
        )

        const result = await usecase.execute(input)

        expect(isLeft(result)).toBeTruthy()
        expect(result.value).toEqual(new Error('Order not found'))
    })

    it('should return an error if payment checkout fails', async () => {
        const input: InputCheckoutDTO = {
            orderId: ORDER_ID,
            token: 'valid-token',
        }
        const mockOrder = new Order(
            new Customer('John Doe', '56911143012'),
            ORDER_ID
        )
        vi.spyOn(mockOrderRepository, 'get').mockResolvedValue(Right(mockOrder))
        vi.spyOn(mockExternalPaymentRepository, 'checkout').mockResolvedValue(
            Left(new Error('Payment checkout failed'))
        )

        const result = await usecase.execute(input)

        expect(isLeft(result)).toBeTruthy()
        expect(result.value).toEqual(new Error('Payment checkout failed'))
    })

    it('should save transaction and return payment details if checkout succeeds', async () => {
        const input: InputCheckoutDTO = {
            orderId: ORDER_ID,
            token: 'valid-token',
        }
        const mockOrder = new Order(
            new Customer('John Doe', '56911143012'),
            ORDER_ID
        )

        const mockProduct = {
            getId: vi.fn(() => 'prod-1'),
            getPrice: vi.fn(() => 100),
            toJSON: vi.fn(() => ({
                id: 'prod-1',
                name: 'Mock Product',
                price: 100,
            })),
        } as unknown as Product

        mockOrder.addProduct(mockProduct, 2)

        const paymentDetails = {
            id: randomUUID(),
            status: 'COMPLETED',
            total: mockOrder.getTotalOrderValue(),
            orderId: ORDER_ID,
            qr_code_data: 'mock-qr-code',
        }

        vi.spyOn(mockOrderRepository, 'get').mockResolvedValue(Right(mockOrder))
        vi.spyOn(mockExternalPaymentRepository, 'checkout').mockResolvedValue(
            Right(paymentDetails)
        )

        const result = await usecase.execute(input)

        expect(isRight(result)).toBeTruthy()
        expect(result.value).toEqual(paymentDetails)
    })
})
