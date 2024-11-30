import { Either } from '../../@Shared/Either'

export default interface IExternalPaymentGatewayRepository {
    checkout(
        token: string,
        orderId: String,
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
    >
    getPaymentStatusById(
        externalPaymentId: String
    ): Promise<Either<Error, String>>
}
