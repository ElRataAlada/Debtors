import React, { CSSProperties } from 'react'
import styles from './ControlButton.module.scss'

interface Props {
    title: string,
    img?: string,
    style?: CSSProperties,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function ControlButton({ title, style, img, onClick }: Props) {
    return (
        <button style={style} onClick={onClick} type='button' className={styles.button}>
            {img && <img src={img} />}
            <h3 className={styles.title}>{title}</h3>
        </button>
    )
}
