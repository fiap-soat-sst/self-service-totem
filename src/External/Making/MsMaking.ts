import axios from 'axios'
import { Either, Left, Right } from '../../@Shared/Either'
import Order from '../../Entities/Order'
import IExternalMakingGatewayRepository from '../../Gateways/contracts/IExternalMakingGatewayRepository'

export default class MsMaking implements IExternalMakingGatewayRepository {
    async create(
        token: string,
        order: Order
    ): Promise<Either<Error, { id: string; status: string }>> {
        const orderJSON = order.toJSON()
        try {
            const baseURL =
                process.env.BASE_URL_MAKING || 'http://localhost:3001'

            const response = await axios.post(
                `${baseURL}/api/kitchen/order`,
                {
                    name: orderJSON.customer.getName(),
                    cpf: orderJSON.customer.getCpf(),
                    products: orderJSON.items,
                },
                {
                    headers: {
                        Token: token,
                        'Content-Type': 'application/json',
                    },
                }
            )

            return Right<{
                id: string
                status: string
            }>(response.data)
        } catch (error) {
            return Left<Error>(error as Error)
        }
    }
}
