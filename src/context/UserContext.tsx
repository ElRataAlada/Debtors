import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { IDebtor, IHistory, IUser } from '../types/user'
import { onAuthStateChanged } from 'firebase/auth'
import FirebaseAPI from '../API/Firebase'


interface IContext {
    user: IUser | null,
    history: IHistory[],
    updateUser: Function,

    selectedDebtor: IDebtor | null,
    setSelectedDebtor: React.Dispatch<React.SetStateAction<IDebtor | null>>,
}

const defaultContext: IContext = {
    user: null,
    history: [],
    updateUser: () => { },

    selectedDebtor: null,
    setSelectedDebtor: () => { },
}

export const AppContext = createContext(defaultContext)

interface Props {
    children: ReactNode
}

export function UserContext({ children }: Props) {

    const [user, setUser] = useState<IUser | null>(FirebaseAPI.user)
    const [history, setHistory] = useState<IHistory[]>([])

    const [selectedDebtor, setSelectedDebtor] = useState<IDebtor | null>(null)

    function updateUser(user: IUser | null) {
        if (!user) {
            setUser(null)
            setHistory([])
            setSelectedDebtor(null)
        }
        else {
            setUser({ ...user, debtors: [...user.debtors].sort() })
            setHistory(FirebaseAPI.getTotalHistory())
        }
    }

    useEffect(() => {
        onAuthStateChanged(FirebaseAPI.auth, async (u) => {
            if (u) {
                const user = await FirebaseAPI.getUser(u.uid)

                if (!user) return

                setUser(user)
                setSelectedDebtor(user.debtors[0])
                setHistory(FirebaseAPI.getTotalHistory())
            }
        })
    }, [])

    return (
        <AppContext.Provider value={{
            user,
            history,
            updateUser,

            selectedDebtor,
            setSelectedDebtor,
        }}>
            {children}
        </AppContext.Provider>
    )
}
