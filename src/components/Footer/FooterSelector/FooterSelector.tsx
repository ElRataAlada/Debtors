import { ReactNode } from 'react'
import styles from './FooterSelector.module.scss'

interface Props {
    children?: ReactNode
}

export default function FooterSelector({ children }: Props) {
    return (
        <div className={styles.footer_selector}>
            {children}
        </div>
    )
}


