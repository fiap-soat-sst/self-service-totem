import Cpf from './ValueObjects/Cpf'

export default class Customer {
    private name: string
    private cpf: Cpf

    constructor(name: string, cpf: string) {
        this.name = name
        this.cpf = new Cpf(cpf)
    }

    setCpf(cpf: string): void {
        this.cpf = new Cpf(cpf)
    }

    setName(name: string): void {
        this.name = name
    }

    getName(): string {
        return this.name
    }

    getCpf(): string {
        return this.cpf.getValue()
    }

    toJSON() {
        return {
            name: this.name,
            cpf: this.cpf.getValue(),
        }
    }
}
