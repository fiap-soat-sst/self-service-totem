import { Either } from '../../@Shared/Either'
import Order from '../../Entities/Order'
import IExternalMakingRepository from '../../External/Making/Contracts/IExternalMakingRepository'
import IExternalMakingGatewayRepository from '../contracts/IExternalMakingGatewayRepository'

export default class ExternalMakingGatewayRepository
    implements IExternalMakingGatewayRepository
{
    constructor(private readonly external: IExternalMakingRepository) {}

    create(
        token: string,
        order: Order
    ): Promise<Either<Error, { id: string; status: string }>> {
        return this.external.create(token, order)
    }
}
