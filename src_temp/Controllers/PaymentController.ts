import { Request, Response } from 'express'
import { isLeft } from '../@Shared/Either'
import CheckoutUseCase from '../UseCases/Payment/checkout/checkout.usecase'
import GetByIdUseCase from '../UseCases/Payment/getById/getById.usecase'
import UpdateStatusUseCase from '../UseCases/Payment/updateStatus/uptateStatus.usecase'
import Order from '../Entities/Order'

export default class PaymentController {
    private checkoutUseCase: CheckoutUseCase
    private getByIdUseCase: GetByIdUseCase
    private updateStatusUseCase: UpdateStatusUseCase

    constructor(
        checkoutUseCase: CheckoutUseCase,
        getByIdUseCase: GetByIdUseCase,
        updateStatusUseCase: UpdateStatusUseCase
    ) {
        this.checkoutUseCase = checkoutUseCase
        this.getByIdUseCase = getByIdUseCase
        this.updateStatusUseCase = updateStatusUseCase
    }

    async checkout(req: Request, res: Response): Promise<void> {
        const { orderId } = req.body
        const result = await this.checkoutUseCase.execute({ orderId })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
        } else {
            res.status(200).json(result.value)
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const result = await this.getByIdUseCase.execute({ id })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
        } else {
            res.status(200).json(result.value)
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        const { status } = req.body
        const result = await this.updateStatusUseCase.execute({ id, status })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
        } else {
            res.status(200).json({
                message: result.value,
            })
        }
    }
}