import { describe, it, expect, vi } from 'vitest'
import { Request, Response } from 'express'
import PaymentController from '../../src/Controllers/PaymentController'
import CheckoutUseCase from '../../src/UseCases/Payment/checkout/checkout.usecase'
import UpdateStatusUseCase from '../../src/UseCases/Payment/updateStatus/uptateStatus.usecase'
import { Left } from '../../src/@Shared/Either'

describe('PaymentController', () => {
    let checkoutUseCaseMock: CheckoutUseCase
    let updateStatusUseCaseMock: UpdateStatusUseCase
    let paymentController: PaymentController

    beforeEach(() => {
        // Criando os mocks dos use cases
        checkoutUseCaseMock = { execute: vi.fn() } as unknown as CheckoutUseCase
        updateStatusUseCaseMock = {
            execute: vi.fn(),
        } as unknown as UpdateStatusUseCase
        paymentController = new PaymentController(
            checkoutUseCaseMock,
            updateStatusUseCaseMock
        )
    })

    describe('checkout', () => {
        it('should return 200 and the result from checkout use case when successful', async () => {
            const mockRequest = {
                body: {
                    orderId: '1234',
                },
                headers: {
                    token: 'valid-token',
                },
            } as unknown as Request
            const mockResponse = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
                setHeader: vi.fn(),
            } as unknown as Response

            const mockCheckoutResult = { value: 'Payment successful' }
            checkoutUseCaseMock.execute = vi
                .fn()
                .mockResolvedValue(mockCheckoutResult)

            await paymentController.checkout(mockRequest, mockResponse)

            expect(checkoutUseCaseMock.execute).toHaveBeenCalledWith({
                token: 'valid-token',
                orderId: '1234',
            })
            expect(mockResponse.status).toHaveBeenCalledWith(200)
            expect(mockResponse.json).toHaveBeenCalledWith(
                mockCheckoutResult.value
            )
        })

        it('should return 400 and error message when checkout use case fails', async () => {
            const mockRequest = {
                body: {
                    orderId: '1234',
                },
                headers: {
                    token: 'valid-token',
                },
            } as unknown as Request
            const mockResponse = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response

            const mockError = new Error('Payment failed')
            checkoutUseCaseMock.execute = vi
                .fn()
                .mockResolvedValue(Left(mockError))

            await paymentController.checkout(mockRequest, mockResponse)

            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith(mockError.message)
        })
    })

    describe('updateStatus', () => {
        it('should return 200 and the success message when updateStatus use case is successful', async () => {
            const mockRequest = {
                params: {
                    orderId: '1234',
                },
                body: {
                    status: 'paid',
                },
                headers: {
                    token: 'valid-token',
                },
            } as unknown as Request
            const mockResponse = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response

            const mockUpdateResult = { value: 'Status updated successfully' }
            updateStatusUseCaseMock.execute = vi
                .fn()
                .mockResolvedValue(mockUpdateResult)

            await paymentController.updateStatus(mockRequest, mockResponse)

            expect(updateStatusUseCaseMock.execute).toHaveBeenCalledWith({
                token: 'valid-token',
                orderId: '1234',
                newStatus: 'paid',
            })
            expect(mockResponse.status).toHaveBeenCalledWith(200)
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: mockUpdateResult.value,
            })
        })

        it('should return 400 and error message when updateStatus use case fails', async () => {
            const mockRequest = {
                params: {
                    orderId: '1234',
                },
                body: {
                    status: 'paid',
                },
                headers: {
                    token: 'valid-token',
                },
            } as unknown as Request
            const mockResponse = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            } as unknown as Response

            const mockError = new Error('Failed to update status')
            updateStatusUseCaseMock.execute = vi
                .fn()
                .mockResolvedValue(Left(mockError))

            await paymentController.updateStatus(mockRequest, mockResponse)

            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith(mockError.message)
        })
    })
})
