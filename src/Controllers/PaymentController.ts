import { Request, Response } from 'express'
import { isLeft } from '../@Shared/Either'
import CheckoutUseCase from '../UseCases/Payment/checkout/checkout.usecase'
import UpdateStatusUseCase from '../UseCases/Payment/updateStatus/uptateStatus.usecase'

export default class PaymentController {
    private checkoutUseCase: CheckoutUseCase
    private updateStatusUseCase: UpdateStatusUseCase

    constructor(
        checkoutUseCase: CheckoutUseCase,
        updateStatusUseCase: UpdateStatusUseCase
    ) {
        this.checkoutUseCase = checkoutUseCase
        this.updateStatusUseCase = updateStatusUseCase
    }

    async checkout(req: Request, res: Response): Promise<void> {
        const { orderId } = req.body
        const { token } = req.headers
        const result = await this.checkoutUseCase.execute({
            token: token as string,
            orderId,
        })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
        } else {
            res.status(200).json(result.value)
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        const { orderId } = req.params
        const { status } = req.body
        const { token } = req.headers

        const result = await this.updateStatusUseCase.execute({
            token: token as string,
            orderId,
            newStatus: status,
        })

        if (isLeft(result)) {
            res.status(400).json(result.value.message)
        } else {
            res.status(200).json({
                message: result.value,
            })
        }
    }
}
