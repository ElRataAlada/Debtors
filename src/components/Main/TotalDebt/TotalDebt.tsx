import { useContext } from 'react'
import styles from "./TotalDebt.module.scss"
import { AppContext } from '../../../context/UserContext'
import InteractiveSpan from './InteractiveSpan/InteractiveSpan'

export default function TotalDebt() {
    const { selectedDebtor, user } = useContext(AppContext)

    return (
        user && selectedDebtor ?
            <div className={styles.wrapper} >
                <div className={styles.name}>{selectedDebtor?.name}</div>

                <div className={styles.main_wrapper}>
                    <div className={styles.total}>
                        <span className={styles.currency}>&#8372;</span>
                        <span className={styles.money}>{selectedDebtor?.money || 0}</span>
                    </div>

                    <div>
                        Per month: <InteractiveSpan>{selectedDebtor?.price}</InteractiveSpan>
                    </div>
                </div>
            </div >
            : <></>
    )
}
