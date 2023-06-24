import React, { CSSProperties } from 'react'
import styles from './FooterButton.module.scss'

interface Props {
    selected: string
    title?: string
    children?: React.ReactNode
    style?: CSSProperties
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
}

export default function FooterButton({ selected, title, children, onClick, style }: Props) {
    return (
        <button type='button' title={title}
            className={[styles.button, selected === title ? styles.selected : ''].join(' ')}
            onClick={onClick} style={style}
        >
            {children}
        </button>
    )
}
