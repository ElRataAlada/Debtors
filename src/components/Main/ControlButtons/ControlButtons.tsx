import React, { ReactNode } from 'react'
import styles from './ControlButtons.module.scss'

interface Props{
    children: ReactNode
}

export default function ControlButtons({children}: Props) {
    return (
        <div className={styles.buttons}>
            {children}
        </div>
    )
}
