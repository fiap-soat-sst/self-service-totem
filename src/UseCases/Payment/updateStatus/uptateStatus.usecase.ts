import { Either, isLeft, Left, Right } from '../../../@Shared/Either'
import { PaymentStatus } from '../../../Entities/Enums/PaymentStatusEnum'
import { StatusEnum } from '../../../Entities/Enums/StatusEnum'
import Transaction from '../../../Entities/Transaction'
import IExternalMakingGatewayRepository from '../../../Gateways/contracts/IExternalMakingGatewayRepository'
import { IOrderGatewayRepository } from '../../../Gateways/contracts/IOrderGatewayRepository'
import { ITransactionGatewayRepository } from '../../../Gateways/contracts/ITransactionGatewayRepository'
import { InputUpdateStatusDTO } from './updateStatus.dto'

export default class UpdateStatusUseCase {
    constructor(
        private readonly transactionRepository: ITransactionGatewayRepository,
        private readonly orderRepository: IOrderGatewayRepository,
        private readonly externalMakingRepository: IExternalMakingGatewayRepository
    ) {}

    async execute(input: InputUpdateStatusDTO): Promise<Either<Error, string>> {
        const transactionSaved = await this.transactionRepository.get(
            input.orderId
        )

        if (isLeft(transactionSaved)) {
            return Left<Error>(
                new Error('Erro ao recuperar status do pagamento')
            )
        }

        const orderSaved = await this.orderRepository.get(input.orderId)

        if (isLeft(orderSaved)) {
            return Left<Error>(new Error('Erro ao recuperar o pedido'))
        }

        const status =
            input.newStatus === 'approved'
                ? PaymentStatus.APPROVED
                : PaymentStatus.DECLINED

        const transaction = new Transaction()
        transaction.paymentId = transactionSaved.value.paymentId
        transaction.status = status
        transaction.order = orderSaved.value

        await this.transactionRepository.save(transaction)

        if (status === PaymentStatus.APPROVED) {
            const result = await this.externalMakingRepository.create(
                input.token,
                orderSaved.value
            )

            if (isLeft(result)) {
                return Left<Error>(result.value)
            }

            const orderUpdated = orderSaved.value

            orderUpdated.updateStatus(StatusEnum.Preparing)

            await this.orderRepository.update(orderUpdated)
        }

        return Right<string>(transaction.paymentId)
    }
}
