import { Router } from 'express'
import PaymentController from '../../../Controllers/PaymentController'
import CheckoutUseCase from '../../../UseCases/Payment/checkout/checkout.usecase'
import UpdateStatusUseCase from '../../../UseCases/Payment/updateStatus/uptateStatus.usecase'
import OrderRepository from '../../Database/Repositories/DatabaseRepository/OrderRepository'
import ExternalPaymentGatewayRepository from '../../../Gateways/Payment/ExternalPaymentGatewayRepository'
import { MsPayment } from '../../Payment/MsPayment'
import ITransactionRepository from '../../Database/Repositories/Contracts/ITransactionRepository'
import { ITransactionGatewayRepository } from '../../../Gateways/contracts/ITransactionGatewayRepository'
import OrderGatewayRepository from '../../../Gateways/Order/OrderGatewayRepository'
import TransactionRepository from '../../Database/Repositories/DatabaseRepository/TransactionRepository'
import TransactionGatewayRepository from '../../../Gateways/Transaction/TransactionGatewayRepository'
import { RouteTypeEnum } from '../../../Entities/Enums/RouteType'
import MsMaking from '../../Making/MsMaking'
import ExternalMakingGatewayRepository from '../../../Gateways/Making/ExternalMakingGatewayRepository'

export default class PaymentRoutes {
    private readonly orderRepository: OrderRepository
    private readonly orderGatewayRepository: OrderGatewayRepository
    private readonly msPayment: MsPayment
    private readonly msMaking: MsMaking
    private readonly paymentController: PaymentController
    private readonly checkoutUseCase: CheckoutUseCase
    private readonly updateStatusUseCase: UpdateStatusUseCase
    private readonly externalPaymentRepository: ExternalPaymentGatewayRepository
    private readonly externalMakingRepository: ExternalMakingGatewayRepository
    private readonly transactionRepository: ITransactionRepository
    private readonly transactionGatewayRepository: ITransactionGatewayRepository

    constructor() {
        this.orderRepository = new OrderRepository()
        this.orderGatewayRepository = new OrderGatewayRepository(
            this.orderRepository
        )
        this.msPayment = new MsPayment()

        this.externalPaymentRepository = new ExternalPaymentGatewayRepository(
            this.msPayment
        )

        this.transactionRepository = new TransactionRepository()
        this.transactionGatewayRepository = new TransactionGatewayRepository(
            this.transactionRepository
        )
        this.checkoutUseCase = new CheckoutUseCase(
            this.orderGatewayRepository,
            this.externalPaymentRepository,
            this.transactionGatewayRepository
        )

        this.msMaking = new MsMaking()

        this.externalMakingRepository = new ExternalMakingGatewayRepository(
            this.msMaking
        )

        this.updateStatusUseCase = new UpdateStatusUseCase(
            this.transactionGatewayRepository,
            this.orderGatewayRepository,
            this.externalMakingRepository
        )

        this.paymentController = new PaymentController(
            this.checkoutUseCase,
            this.updateStatusUseCase
        )
    }

    buildRouter(): Router {
        const router = Router()
        router.post('/checkout', this.paymentController.checkout.bind(this))
        router.post(
            `/${RouteTypeEnum.PROTECTED}/update-status/:orderId`,
            this.paymentController.updateStatus.bind(this)
        )
        return router
    }
}
