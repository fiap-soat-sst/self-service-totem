import axios from 'axios'
import { Either, Left, Right } from '../../@Shared/Either'
import IExternalPaymentGatewayRepository from '../../Gateways/contracts/IExternalPaymentGatewayRepository'

export class MsPayment implements IExternalPaymentGatewayRepository {
    async checkout(
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
    > {
        try {
            const baseURL = process.env.BASE_URL || 'http://localhost:3001'

            const response = await axios.post(
                `${baseURL}/api/payment/checkout`,
                {
                    orderId,
                    total,
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
                total: number
                orderId: string
                qr_code_data: string
            }>(response.data)
        } catch (error) {
            return Left<Error>(error as Error)
        }
    }
    getPaymentStatusById(
        externalPaymentId: String
    ): Promise<Either<Error, String>> {
        throw new Error('Method not implemented.')
    }
}
