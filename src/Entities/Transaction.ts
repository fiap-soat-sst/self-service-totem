import Order from './Order'

export default class Transaction {
    id: string
    paymentId: string
    status: string
    order: Order

    constructor() {}

    toJson() {
        return {
            id: this.id,
            paymentId: this.paymentId,
            status: this.status,
            orderId: this.order.getId(),
        }
    }
}
