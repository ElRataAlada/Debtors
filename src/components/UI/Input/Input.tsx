import React from 'react'

import styles from './Input.module.scss'

interface Props {
    required: boolean,
    placeholder: string,
    type: React.HTMLInputTypeAttribute,
    Ref?: React.RefObject<HTMLInputElement>,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    onBlur?: React.FocusEventHandler<HTMLInputElement>,
    onFocus?: React.FocusEventHandler<HTMLInputElement>,
    autoFocus?: boolean,
    value?: string | number | readonly string[],
    className?: string | undefined
}

export default function Input({ type, placeholder, required, Ref, onChange, autoFocus, className, onBlur, onFocus, value }: Props) {
    return (
        <div className={[styles.label_group, className].join(' ')}>
            <input
                value={value}
                onBlur={onBlur}
                onFocus={onFocus}
                className={styles.input}
                type={type}
                onChange={onChange}
                id={placeholder}
                placeholder={placeholder}
                ref={Ref}
                required={required}
                autoFocus={autoFocus}
            />
            <label className={styles.label}
                data-placeholder={placeholder}
                htmlFor={placeholder}
            />
        </div>
    )
}
