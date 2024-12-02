import { Either, isLeft, Left, Right } from '../../../@Shared/Either'
import IExternalPaymentGatewayRepository from '../../../Gateways/contracts/IExternalPaymentGatewayRepository'
import { IOrderGatewayRepository } from '../../../Gateways/contracts/IOrderGatewayRepository'
import { ITransactionGatewayRepository } from '../../../Gateways/contracts/ITransactionGatewayRepository'
import { InputCheckoutDTO, OutputCheckoutDTO } from './checkout.dto'
import Transaction from '../../../Entities/Transaction'

export default class CheckoutUseCase {
    constructor(
        private readonly orderRepository: IOrderGatewayRepository,
        private readonly externalPaymentRepository: IExternalPaymentGatewayRepository,
        private readonly transactionRepository: ITransactionGatewayRepository
    ) {}

    async execute(
        input: InputCheckoutDTO
    ): Promise<Either<Error, OutputCheckoutDTO>> {
        const order = await this.orderRepository.get(input.orderId)

        if (isLeft(order)) {
            return Left<Error>(order.value)
        }

        const orderJson = order.value.toJSON()

        const result = await this.externalPaymentRepository.checkout(
            input.token,
            input.orderId,
            orderJson.total
        )

        if (isLeft(result)) {
            return Left<Error>(result.value)
        }

        const transaction = new Transaction()
        transaction.paymentId = result.value.id
        transaction.status = result.value.status
        transaction.order = order.value

        await this.transactionRepository.save(transaction)

        return Right(result.value)
    }
}
