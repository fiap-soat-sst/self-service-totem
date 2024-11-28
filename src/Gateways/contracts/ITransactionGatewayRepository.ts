import { Either } from '../../@Shared/Either'
import Transaction from '../../Entities/Transaction'

export interface ITransactionGatewayRepository {
    save(transaction: Transaction): Promise<Either<Error, string>>
    get(orderId: string): Promise<Either<Error, Transaction>>
}
