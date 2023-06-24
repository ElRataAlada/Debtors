export interface IUser{
    uid: string
    photoUrl: string | null,
    name: string | null,
    lastUpdate: number,
    debtors: IDebtor[],
}

export interface IDebtor{
    name: string, 
    money: number,
    price: number,
    paymentHistory: IHistory[],
}

export interface IHistory{
    date: number,
    moneyPaid: number,
    money: number,
    debtor: IDebtor
    paymentPurpose?: string,
}