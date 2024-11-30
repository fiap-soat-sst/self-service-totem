import { isLeft, isRight, Left, Right } from '../../../src/@Shared/Either'
import { PaymentStatus } from '../../../src/Entities/Enums/PaymentStatusEnum'
import UpdateStatusUseCase from '../../../src/UseCases/Payment/updateStatus/uptateStatus.usecase'
import { InputUpdateStatusDTO } from '../../../src/UseCases/Payment/updateStatus/updateStatus.dto'
import { vi } from 'vitest'
import { randomUUID } from 'crypto'
import { ITransactionGatewayRepository } from '../../../src/Gateways/contracts/ITransactionGatewayRepository'
import { IOrderGatewayRepository } from '../../../src/Gateways/contracts/IOrderGatewayRepository'
import Transaction from '../../../src/Entities/Transaction'

describe('UpdateStatusUseCase', () => {
    let usecase: UpdateStatusUseCase
    let mockTransactionRepository: ITransactionGatewayRepository
    let mockOrderRepository: IOrderGatewayRepository

    beforeEach(() => {
        mockTransactionRepository = {
            get: vi.fn(),
            save: vi.fn(),
        }

        mockOrderRepository = {
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            get: vi.fn(),
            getAll: vi.fn(),
            list: vi.fn(),
        }

        usecase = new UpdateStatusUseCase(
            mockTransactionRepository as any,
            mockOrderRepository as any
        )
    })

    it('should return an error if transaction retrieval fails', async () => {
        const input: InputUpdateStatusDTO = {
            orderId: randomUUID(),
            newStatus: 'approved',
        }

        mockTransactionRepository.get = vi
            .fn()
            .mockResolvedValue(Left(new Error('Error retrieving transaction')))

        const result = await usecase.execute(input)

        expect(isLeft(result)).toBeTruthy()
        expect(result.value).toEqual(
            new Error('Erro ao recuperar status do pagamento')
        )
    })

    it('should return an error if order retrieval fails', async () => {
        const input: InputUpdateStatusDTO = {
            orderId: randomUUID(),
            newStatus: 'approved',
        }

        mockTransactionRepository.get = vi.fn().mockResolvedValue(
            Right({
                paymentId: randomUUID(),
                status: PaymentStatus.APPROVED,
            })
        )
        mockOrderRepository.get = vi
            .fn()
            .mockResolvedValue(Left(new Error('Error retrieving order')))

        const result = await usecase.execute(input)

        expect(isLeft(result)).toBeTruthy()
        expect(result.value).toEqual(new Error('Erro ao recuperar o pedido'))
    })

    it('should update status to APPROVED if newStatus is approved', async () => {
        const input: InputUpdateStatusDTO = {
            orderId: randomUUID(),
            newStatus: 'approved',
        }

        const mockTransaction = {
            paymentId: randomUUID(),
            status: PaymentStatus.APPROVED,
        }
        const mockOrder = { id: randomUUID() }

        mockTransactionRepository.get = vi
            .fn()
            .mockResolvedValue(Right(mockTransaction))
        mockOrderRepository.get = vi.fn().mockResolvedValue(Right(mockOrder))
        mockTransactionRepository.save = vi
            .fn()
            .mockResolvedValue(Right('Transaction saved successfully'))

        const result = await usecase.execute(input)

        expect(isRight(result)).toBeTruthy()
        expect(result.value).toEqual(mockTransaction.paymentId)
        expect(mockTransactionRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                paymentId: mockTransaction.paymentId,
                status: PaymentStatus.APPROVED,
                order: mockOrder,
            })
        )
    })

    it('should update status to DECLINED if newStatus is not approved', async () => {
        const input: InputUpdateStatusDTO = {
            orderId: randomUUID(),
            newStatus: 'declined',
        }

        const mockTransaction = {
            paymentId: randomUUID(),
            status: PaymentStatus.APPROVED,
        }
        const mockOrder = { id: randomUUID() }

        mockTransactionRepository.get = vi
            .fn()
            .mockResolvedValue(Right(mockTransaction))
        mockOrderRepository.get = vi.fn().mockResolvedValue(Right(mockOrder))
        mockTransactionRepository.save = vi
            .fn()
            .mockResolvedValue(Right('Transaction saved successfully'))

        const result = await usecase.execute(input)

        expect(isRight(result)).toBeTruthy()
        expect(result.value).toEqual(mockTransaction.paymentId)
        expect(mockTransactionRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                paymentId: mockTransaction.paymentId,
                status: PaymentStatus.DECLINED,
                order: mockOrder,
            })
        )
    })
})
