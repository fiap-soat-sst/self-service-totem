import { Either, isLeft, Left, Right } from '../../../@Shared/Either'
import { PaymentStatus } from '../../../Entities/Enums/PaymentStatusEnum'
import Transaction from '../../../Entities/Transaction'
import { IOrderGatewayRepository } from '../../../Gateways/contracts/IOrderGatewayRepository'
import { ITransactionGatewayRepository } from '../../../Gateways/contracts/ITransactionGatewayRepository'
import { InputUpdateStatusDTO } from './updateStatus.dto'

export default class UpdateStatusUseCase {
    constructor(
        private readonly transactionRepository: ITransactionGatewayRepository,
        private readonly orderRepository: IOrderGatewayRepository
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

        return Right<string>(transaction.paymentId)
    }
}
