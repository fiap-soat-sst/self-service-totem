import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Order } from './Order'

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    paymentId: string

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
    })
    status: string

    @ManyToOne(() => Order, (order) => order.transactions, {
        nullable: false,
    })
    order: Order

    @CreateDateColumn()
    createdAt: Date
}
