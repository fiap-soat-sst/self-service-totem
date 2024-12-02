import { describe, it, expect, vi } from 'vitest'
import PrepareOrderUseCase from '../../../src/UseCases/Order/prepare/prepare.usecase'
import { IOrderGatewayRepository } from '../../../src/Gateways/contracts/IOrderGatewayRepository'
import { isLeft, isRight, Left, Right } from '../../../src/@Shared/Either'
import { InputPrepareOrderDTO } from '../../../src/UseCases/Order/prepare/prepare.dto'
import Order from '../../../src/Entities/Order'
import { StatusEnum } from '../../../src/Entities/Enums/StatusEnum'
import StatusOrderException from '../../../src/@Shared/StatusOrderException'
import Customer from '../../../src/Entities/Customer'

describe('FinishOrderUseCase', () => {
    let prepareOrderUseCase: PrepareOrderUseCase
    let mockOrderRepository: Partial<IOrderGatewayRepository>

    beforeEach(() => {
        mockOrderRepository = {
            get: vi.fn(),
            update: vi.fn(),
        }

        prepareOrderUseCase = new PrepareOrderUseCase(
            mockOrderRepository as IOrderGatewayRepository
        )
    })

    it('should return an error if the order does not exist', async () => {
        const orderId = 'nonexistent-order-id'

        mockOrderRepository.get = vi
            .fn()
            .mockResolvedValue(Left<Error>(new Error('Order not found')))

        const input: InputPrepareOrderDTO = { id: orderId }
        const result = await prepareOrderUseCase.execute(input)

        expect(isLeft(result)).toBe(true)
        if (isLeft(result)) {
            expect(result.value.message).toBe('Order not found')
        }
        expect(mockOrderRepository.get).toHaveBeenCalledWith(orderId)
    })

    it('should update the order status to "Preparing" when the order is "Received"', async () => {
        const customer = new Customer('John Doe', '76176752086')
        const mockOrder = new Order(customer, '123', StatusEnum.Received)
        mockOrder.updateStatus = vi.fn()

        mockOrderRepository.get = vi.fn().mockResolvedValue(Right(mockOrder))
        mockOrderRepository.update = vi.fn().mockResolvedValue(Right('123'))

        const input: InputPrepareOrderDTO = { id: '123' }

        const result = await prepareOrderUseCase.execute(input)

        expect(isRight(result)).toBe(true)
        if (isRight(result)) {
            expect(result.value).toBe('123')
        }
        expect(mockOrder.updateStatus).toHaveBeenCalledWith(
            StatusEnum.Preparing
        )
        expect(mockOrderRepository.update).toHaveBeenCalledWith(mockOrder)
    })

    it('should return an error if the current order status does not allow Preparing', async () => {
        const customer = new Customer('John Doe', '76176752086')
        const invalidStatusOrder = new Order(customer, '123', StatusEnum.Ready)

        invalidStatusOrder.updateStatus = vi.fn(() => {
            throw new StatusOrderException(
                'Only orders with status Received can be prepare'
            )
        })

        mockOrderRepository.get = vi
            .fn()
            .mockResolvedValue(Right(invalidStatusOrder))

        const input: InputPrepareOrderDTO = { id: '123' }

        await expect(prepareOrderUseCase.execute(input)).rejects.toThrow(
            'Only orders with status Received can be prepare'
        )
    })
})
