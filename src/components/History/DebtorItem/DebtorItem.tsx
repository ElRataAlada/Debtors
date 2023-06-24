import { useContext } from 'react'
import { IDebtor } from '../../../types/user'
import styles from './DebtorItem.module.scss'
import { AppContext } from '../../../context/UserContext'

interface Props {
    debtor: IDebtor
    selected?: IDebtor | null,
}

export default function DebtorItem({ debtor, selected }: Props) {
    const { setSelectedDebtor } = useContext(AppContext)

    return (
        <div className={[styles.item, selected?.name === debtor.name ? styles.selected : undefined].join(' ')} onClick={() => { setSelectedDebtor(debtor) }}>
            <div className={styles.main_info}>
                <div className={styles.name}>{debtor.name}</div>
                <div className={styles.per_month}>Per Month: <span>{debtor.price}</span></div>
            </div>

            <div className={styles.money}
                style={debtor.money >= 0 ? { color: '#009900' } : { color: 'red' }}>
                {debtor.money}
            </div>
        </div>
    )
}
