import React, { ReactNode } from 'react'
import styles from './History.module.scss'

interface Props {
    children: ReactNode | ReactNode[],
    Ref?: React.LegacyRef<HTMLDivElement> | undefined
}

export default function History({ children, Ref}: Props) {
    return (
        <div ref={Ref} className={styles.history}>
            {children}
        </div>
    )
}
