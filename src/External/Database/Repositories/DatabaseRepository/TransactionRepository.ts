import { Repository } from 'typeorm'
import { AppDataSource } from '../../MySqlAdapter'
import { Either, Left, Right } from '../../../../@Shared/Either'
import { Transaction as model } from '../../Models/Transaction'
import Transaction from '../../../../Entities/Transaction'
import ITransactionRepository from '../Contracts/ITransactionRepository'
import { Order } from '../../Models/Order'

export default class TransactionRepository implements ITransactionRepository {
    private repository: Repository<model>

    constructor() {
        this.repository = AppDataSource.getRepository(model)
    }

    async get(orderId: string): Promise<Either<Error, Transaction>> {
        try {
            const transactionModel = await this.repository.findOne({
                where: { order: { id: orderId } },
                order: { createdAt: 'DESC' },
            })

            if (!transactionModel) {
                throw new Error('Transaction not found')
            }

            const transaction = new Transaction()
            transaction.id = transactionModel.id
            transaction.paymentId = transactionModel.paymentId
            transaction.status = transactionModel.status

            return Right<Transaction>(transaction)
        } catch (error) {
            return Left<Error>(error as Error)
        }
    }

    async save(transaction: Transaction): Promise<Either<Error, string>> {
        try {
            const transactionModel = new model()
            transactionModel.paymentId = transaction.paymentId
            transactionModel.status = transaction.status

            const orderModel = new Order()
            orderModel.id = transaction.order.getId() as string
            transactionModel.order = orderModel

            const transactionSaved = await this.repository.save(
                transactionModel
            )
            return Right<string>(transactionSaved.id)
        } catch (error) {
            return Left<Error>(error as Error)
        }
    }
}
