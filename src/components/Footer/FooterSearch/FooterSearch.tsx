import React, { useRef } from 'react'
import styles from './FooterSearch.module.scss'
import Input from '../../UI/Input/Input'

interface Props {
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    isInputShown: boolean,
    setIsInputShown: React.Dispatch<React.SetStateAction<boolean>>,
    selectedMenuItem: string,
    query?: string
}

export default function FooterSearch({ setQuery, isInputShown, setIsInputShown, selectedMenuItem, query }: Props) {
    const searchRef = useRef<HTMLInputElement>(null)

    return (
        <div className={styles.wrapper}>
            {selectedMenuItem === 'History' && <>
                <Input Ref={searchRef}
                    className={isInputShown ? styles.open : styles.hidden}
                    placeholder=' '
                    required={false} type='text'
                    onChange={(e) => setQuery(e.currentTarget.value)}
                    onBlur={() => query === '' && setIsInputShown(false)}
                    value={query}
                />

                <button onClick={() => {
                    !isInputShown && searchRef.current?.focus()
                    isInputShown && searchRef.current?.blur()

                    if (isInputShown && query) {
                        searchRef.current?.focus()
                        return
                    }

                    setIsInputShown(prev => !prev)
                }}
                    className={styles.button} type='button'
                >
                    <img className='white-filter' src="./img/ico/search.png" alt="search" />
                </button>
            </>
            }
        </div>
    )
}
