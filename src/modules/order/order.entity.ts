import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  @ApiProperty({ description: 'User', example: 'user1' })
  @Column()
  user: string

  @ApiProperty({ description: 'Product', example: 'Sample Product' })
  product: string

  @Column({ unique: true })
  openid: string

  @Column()
  remainCount: number //Remaining Number

  @ApiPropertyOptional({ description: '订单备注', example: '双十一特惠' })
  @Column()
  remark?: string

  @ApiPropertyOptional({ description: 'Creation Time' })
  @CreateDateColumn()
  readonly createdDate?: Date

  @ApiPropertyOptional({ description: 'Update Time' })
  @UpdateDateColumn()
  readonly updateDate?: Date

  @Column()
  kafkaRawMessage?: string //从kafka获取的消费原始数据
}