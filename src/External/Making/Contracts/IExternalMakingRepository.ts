import { Either } from '../../../@Shared/Either'
import Order from '../../../Entities/Order'

export default interface IExternalMakingRepository {
    create(
        token: string,
        order: Order
    ): Promise<Either<Error, { id: string; status: string }>>
}
