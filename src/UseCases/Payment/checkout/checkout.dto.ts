export interface InputCheckoutDTO {
    token: string
    orderId: string
}

export interface OutputCheckoutDTO {
    id: string
    status: string
    total: number
    orderId: string
    qr_code_data: string
}
