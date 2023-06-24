import { useState } from 'react'
import { IHistory } from '../../../types/user'
import styles from './HistoryItem.module.scss'

interface Props {
    item: IHistory
}

export default function HistoryItem({ item }: Props) {
    return (
        <div className={styles.item}>
            <div className={styles.main_info}>
                <div className={styles.info_wrapper}>
                    <div className={styles.name}>
                        {item.debtor.name}
                    </div>
                    {item.paymentPurpose && <div className={styles.purpose}>{"(" + item.paymentPurpose + ")"}</div>}
                </div>
                <div className={styles.date}>{new Date(item.date).toLocaleString()}</div>
            </div>

            <div className={styles.money}
                style={item.moneyPaid > 0 ? { color: '#009900' } : { color: 'red' }}>
                {item.moneyPaid > 0 ? "+ " : "- "}
                {Math.abs(item.moneyPaid)}
            </div>
        </div>
    )
}
