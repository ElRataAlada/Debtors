import styles from './HistoryTimeItem.module.scss'

interface Props {
    date: Date
}

export default function HistoryTimeItem({ date }: Props) {
    return (
        <div className={styles.item}>
            {date.toLocaleDateString()}
        </div>
    )
}
