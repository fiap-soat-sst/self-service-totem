import { Given, When, Then } from '@cucumber/cucumber'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import assert from 'assert'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT
const baseUrl = `http://localhost:${port}/api` // URL do servidor em execução

let response: request.Response
let token: string
let order: any = {}


const jwtSecret = process.env.JWT_SECRET || ''

Given('que o cliente não se identifica', async () => {
    token = jwt.sign({ name: 'Teste', type: 'unregistered user' }, jwtSecret)
})

Given('que o cliente se identifica via CPF {string}', async (cpf: string) => {
    token = jwt.sign({ name: 'Teste', user_name: 'Teste', type: 'user', cpf }, jwtSecret)
    order.cpf = cpf
})

When('o cliente seleciona o produto {string} da categoria {string} nessa quantidade {string}', async (productName: string, productType: string, productQuantity: string) => {
    const productResponse = await request(baseUrl)
        .get(`/product/${productType}`)
        .set({ 'token': token })
        .expect(200)
    
    const product = productResponse.body.products.find((product: any) => product.name === productName)
    if (!product) {
        throw new Error('Product not found')
    }

    order.products = [{ id: product.id, quantity: productQuantity }]
})

When('o cliente cria o pedido', async () => {
    response = await request(baseUrl)
        .post('/order')
        .set({ 'token': token })
        .send(order)
})

Then('o pedido é criado com sucesso', () => {
    assert.equal(response.status, 201)
    assert(response.body.hasOwnProperty('id'))
    order.id = response.body.id
})

