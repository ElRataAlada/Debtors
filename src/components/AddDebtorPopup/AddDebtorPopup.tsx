import React, { useContext, useRef } from 'react'
import styles from './AddDebtorPopup.module.scss'
import Popup from '../UI/Popup/Popup'
import { IDebtor } from '../../types/user'
import Input from '../UI/Input/Input'
import ControlButton from '../Main/ControlButtons/ControlButton/ControlButton'
import FirebaseAPI from '../../API/Firebase'
import { AppContext } from '../../context/UserContext'

interface Props {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function AddDebtorPopup({ isOpen, setIsOpen }: Props) {

    const { updateUser, setSelectedDebtor } = useContext(AppContext)

    const nameRef = useRef<HTMLInputElement>(null)
    const debtRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)

    async function submitHandler(e: any) {
        e.preventDefault()

        if (!nameRef.current || !debtRef.current || !priceRef.current) return

        const name = nameRef.current?.value
        const debt = debtRef.current?.value
        const price = priceRef.current?.value

        if (!name || !debt || !price) {
            nameRef.current.value = ''
            debtRef.current.value = ''
            priceRef.current.value = ''
            return
        }

        const debtor: IDebtor = {
            money: -debt,
            name: name,
            price: +price,
            paymentHistory: [],
        }

        const user = await FirebaseAPI.addDebtor(debtor)
        updateUser(user)

        nameRef.current.value = ''
        debtRef.current.value = ''
        priceRef.current.value = ''

        const d = user?.debtors.find(d => d.name === debtor.name)

        if (d) setSelectedDebtor(d)
        setIsOpen(false)
    }

    return (
        <Popup isOpen={isOpen} setIsOpen={setIsOpen} >
            <form
                className={styles.form}
                onSubmit={(e) => submitHandler(e)}
            >
                <h2 className={styles.title}>Add Debtor</h2>
                <div className={styles.inputs}>
                    <Input autoFocus required placeholder='Name' type="text" Ref={nameRef} />
                    <Input required placeholder='Debt' type="number" Ref={debtRef} />
                    <Input required placeholder='Month price' type="number" Ref={priceRef} />
                </div>

                <ControlButton
                    title='Add'
                    style={{ height: '50px', borderRadius: "100px", marginTop: '-20px'}}

                    onClick={(e) => submitHandler(e)}
                />
            </form>
        </Popup>
    )
}
