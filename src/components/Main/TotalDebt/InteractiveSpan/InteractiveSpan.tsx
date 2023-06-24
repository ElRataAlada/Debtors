import { useState, useContext } from 'react'
import styles from './InteractiveSpan.module.scss'
import FirebaseAPI from '../../../../API/Firebase'
import { AppContext } from '../../../../context/UserContext'

interface Props {
    children: string | number | undefined,
}

export default function InteractiveSpan({ children }: Props) {
    const [isInput, setIsInput] = useState<boolean>(false)

    const { updateUser, selectedDebtor } = useContext(AppContext)

    async function setPrice(price: number) {
        if (!selectedDebtor) return
        updateUser(await FirebaseAPI.setPrice(selectedDebtor, price))
    }

    if (isInput)
        return <input className={styles.input} autoFocus type='text' value={children}
            onBlur={() => setIsInput(false)}
            onFocus={(e) => e.target.size = e.target.value.length}
            onChange={async (e) => { await setPrice(+e.target.value || 0); e.target.size = e.target.value.length }}
        />

    else return <span className={styles.span} onClick={() => setIsInput(true)}>{children}</span>
}
