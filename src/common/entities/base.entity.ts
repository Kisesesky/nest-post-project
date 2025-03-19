import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ 
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        transformer: {
            from: (value: Date) => value,
            to: () => new Date()
        }
    })
    createdAt: Date;

    @UpdateDateColumn({ 
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        transformer: {
            from: (value: Date) => value,
            to: () => new Date()
        }
    })
    updatedAt: Date;
    
}