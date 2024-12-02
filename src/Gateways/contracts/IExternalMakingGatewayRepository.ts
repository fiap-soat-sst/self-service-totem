import { Either } from '../../@Shared/Either'
import Order from '../../Entities/Order'

export default interface IExternalMakingGatewayRepository {
    create(
        token: string,
        order: Order
    ): Promise<Either<Error, { id: string; status: string }>>
}
