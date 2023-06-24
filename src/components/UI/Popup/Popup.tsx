import React from 'react'
import styles from './Popup.module.scss'

interface Props {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    children?: React.ReactNode,
}

export default function Popup({ isOpen, setIsOpen, children }: Props) {
    return (
        isOpen ?
            <div className={styles.wrapper} onClick={() => { setIsOpen(false) }}>
                <div className={styles.popup} onClick={(e) => { e.stopPropagation() }}>
                    {children}
                </div>
            </div>
            : <></>
    )
}
