import { Either } from '../../@Shared/Either'
import Transaction from '../../Entities/Transaction'
import ITransactionRepository from '../../External/Database/Repositories/Contracts/ITransactionRepository'
import { ITransactionGatewayRepository } from '../contracts/ITransactionGatewayRepository'

export default class TransactionGatewayRepository
    implements ITransactionGatewayRepository
{
    constructor(private readonly repository: ITransactionRepository) {}
    get(orderId: string): Promise<Either<Error, Transaction>> {
        return this.repository.get(orderId)
    }

    save(transaction: Transaction): Promise<Either<Error, string>> {
        return this.repository.save(transaction)
    }
}
