import { Either } from '../../@Shared/Either'
import IExternalPaymentRepository from '../../External/Payment/Contracts/IExternalPaymentRepository'
import IExternalPaymentGatewayRepository from '../contracts/IExternalPaymentGatewayRepository'

export default class ExternalPaymentGatewayRepository
    implements IExternalPaymentGatewayRepository
{
    constructor(private readonly external: IExternalPaymentRepository) {}

    async checkout(
        token: string,
        orderId: string,
        total: number
    ): Promise<
        Either<
            Error,
            {
                id: string
                status: string
                total: number
                orderId: string
                qr_code_data: string
            }
        >
    > {
        return this.external.checkout(token, orderId, total)
    }

    async getPaymentStatusById(
        externalPaymentId: String
    ): Promise<Either<Error, String>> {
        return this.external.getPaymentStatusById(externalPaymentId)
    }
}
