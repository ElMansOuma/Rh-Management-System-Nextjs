// types/pointage.ts
export interface Pointage {
    id: string;
    userId: string;
    type: 'arrivee' | 'depart';
    timestamp: Date;
    validated: boolean;
    modifiedByAdmin?: boolean;
    originalTimestamp?: Date;
}


