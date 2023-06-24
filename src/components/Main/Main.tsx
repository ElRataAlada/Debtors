import React from 'react'
import styles from './Main.module.scss'

interface Props {
    children?: React.ReactNode,
    Ref?: React.LegacyRef<HTMLElement> | undefined
}

export default function Main({ children, Ref}: Props) {
    return (
        <main ref={Ref} className={styles.main}>
            {children}
        </main>
    )
}
