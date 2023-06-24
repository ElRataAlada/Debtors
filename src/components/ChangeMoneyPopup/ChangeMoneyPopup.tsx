import React, { useContext, useRef } from 'react'
import styles from './ChangeMoneyPopup.module.scss'
import Popup from '../UI/Popup/Popup'
import Input from '../UI/Input/Input'
import ControlButton from '../Main/ControlButtons/ControlButton/ControlButton'
import FirebaseAPI from '../../API/Firebase'
import { AppContext } from '../../context/UserContext'
import { MoneyChangeMode } from '../../types/app'

interface Props {
    changeMode: MoneyChangeMode,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function ChangeMoneyPopup({ changeMode, isOpen, setIsOpen }: Props) {

    const { updateUser, selectedDebtor } = useContext(AppContext)

    const moneyRef = useRef<HTMLInputElement>(null)

    async function submitHandler(e: any) {
        e.preventDefault()

        if (!moneyRef.current || !selectedDebtor) return

        const money = moneyRef.current.value

        if (!money) {
            moneyRef.current.value = ''
            return
        }

        let user
        if (changeMode === MoneyChangeMode.BORROW) user = await FirebaseAPI.debtorBorrow(selectedDebtor, +money || 0)
        else if (changeMode === MoneyChangeMode.RECEIVE) user = await FirebaseAPI.debtorPaid(selectedDebtor, +money || 0)

        if (user) updateUser(user)

        moneyRef.current.value = ''

        setIsOpen(false)
    }

    return (
        <Popup isOpen={isOpen} setIsOpen={setIsOpen} >
            <form
                className={styles.form}
                onSubmit={async (e) => await submitHandler(e)}
            >
                <div className={styles.inputs}>
                    <Input autoFocus required placeholder='Money' type="number" Ref={moneyRef} />
                </div>

                <ControlButton
                    title={
                        changeMode === MoneyChangeMode.BORROW && 'Borrow'
                        ||
                        changeMode === MoneyChangeMode.RECEIVE && 'Receive'
                        ||
                        'Pay'
                    }
                    style={{ height: '50px', borderRadius: "100px", marginTop: '-20px' }}

                    onClick={async (e) => await submitHandler(e)}
                />
            </form>
        </Popup>
    )
}
