import { Either, isLeft, isRight } from '../../../@Shared/Either'
import Customer from '../../../Entities/Customer'
import Order from '../../../Entities/Order'
import OrderItem from '../../../Entities/OrderItem'
import Cpf from '../../../Entities/ValueObjects/Cpf'
import { IOrderGatewayRepository } from '../../../Gateways/contracts/IOrderGatewayRepository'
import { IProductGatewayRepository } from '../../../Gateways/contracts/IProductGatewayRepository'
import { InputCreateOrderDTO } from './create.dto'

export default class CreateOrderUseCase {
    constructor(
        private readonly orderRepository: IOrderGatewayRepository,
        private readonly productRepository: IProductGatewayRepository
    ) {}

    async execute(
        orderCustomer: InputCreateOrderDTO
    ): Promise<Either<Error, string>> {
        const { name, cpf, products } = orderCustomer

        let customer: Customer = new Customer(name, cpf)

        const order = new Order(customer)

        for (const product of products) {
            const resultProduct = await this.productRepository.findById(
                product.id
            )

            if (isLeft(resultProduct)) {
                throw new Error('Product not found')
            }

            const productFind = resultProduct.value

            order.addItem(new OrderItem(productFind, product.quantity))
        }

        return this.orderRepository.create(order)
    }
}
