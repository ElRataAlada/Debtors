import styles from './Footer.module.scss'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    Ref: React.LegacyRef<HTMLElement> | undefined,
}

export default function Footer({ children, Ref }: Props) {

    return (
        <footer ref={Ref} className={styles.footer}>
            {children}
        </footer>
    )
}
