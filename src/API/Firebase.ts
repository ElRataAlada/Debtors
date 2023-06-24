import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, Firestore } from "firebase/firestore";
import { IDebtor, IHistory, IUser } from "../types/user";


export default class FirebaseAPI {
    private static firebaseConfig = {
        apiKey: "AIzaSyDvsxXi9bWPlUAP4Bk9tcqCDO7iCNP82pE",
        authDomain: "debtors-2.firebaseapp.com",
        projectId: "debtors-2",
        storageBucket: "debtors-2.appspot.com",
        messagingSenderId: "454729212667",
        appId: "1:454729212667:web:b6140e91e28ddeff6fc65e"
    }

    private static app = initializeApp(FirebaseAPI.firebaseConfig)
    private static db = getFirestore(FirebaseAPI.app)
    static auth = getAuth(FirebaseAPI.app)

    static user: IUser | null = null

    static async logIn(): Promise<IUser> {
        const responce = await signInWithPopup(FirebaseAPI.auth, new GoogleAuthProvider())

        let user: IUser | null = await FirebaseAPI.getUser(responce.user.uid)

        if (user) {
            setDoc(doc(FirebaseAPI.db, 'users', user.uid), user)
            FirebaseAPI.user = user
            return user
        }

        const now = new Date()
        now.setHours(0, 0, 0, 0)

        user = {
            debtors: [],
            uid: responce.user.uid,
            name: responce.user.displayName,
            photoUrl: responce.user.photoURL,
            lastUpdate: now.getTime()
        }

        setDoc(doc(FirebaseAPI.db, 'users', user.uid), user)
        FirebaseAPI.user = user
        return user
    }

    static async setPrice(debtor: IDebtor, price: number) {
        if (!FirebaseAPI.user) throw Error('You are not authorized')
        const d = FirebaseAPI.user?.debtors.find(d => d.name === debtor.name)

        if (!d) throw Error('No such debtor found')

        d.price = price

        await updateDoc(doc(FirebaseAPI.db, 'users', FirebaseAPI.user.uid), { 'debtors': FirebaseAPI.user.debtors })
        return FirebaseAPI.user
    }

    static async logOut(): Promise<void> { signOut(FirebaseAPI.auth) }

    static async addDebtor(debtor: IDebtor) {
        if (!FirebaseAPI.user) throw Error('You are not authorized')
        FirebaseAPI.user.debtors.push(debtor)
        
        await setDoc(doc(FirebaseAPI.db, 'users', FirebaseAPI.user.uid), FirebaseAPI.user)
        return FirebaseAPI.user
    }
    
    static async deleteDebtor(debtor: IDebtor){
        if (!FirebaseAPI.user) throw Error('You are not authorized')

        const debtors = FirebaseAPI.user.debtors.filter(d => d.name != debtor.name)

        await updateDoc(doc(FirebaseAPI.db, 'users', FirebaseAPI.user.uid), {'debtors': debtors})

        FirebaseAPI.user.debtors = debtors
        return FirebaseAPI.user
    }

    private static async updateData(): Promise<IUser> {
        if (!FirebaseAPI.user) throw Error('You are not authorized')

        const now: Date = new Date()
        const lastUpdate: Date = new Date(FirebaseAPI.user.lastUpdate)

        const dYear = now.getFullYear() - lastUpdate.getFullYear()

        const absoluteNow = now
        absoluteNow.setHours(0, 0, 0, 0)

        if (now.getMonth() > lastUpdate.getMonth() || dYear) {
            FirebaseAPI.user.debtors.map(debtor => {

                const dMonth = now.getMonth() - lastUpdate.getMonth() + dYear * 12

                debtor.money -= debtor.price * dMonth

                if (debtor.price * dMonth != 0) {
                    const historyItem: IHistory = {
                        date: absoluteNow.getTime(),
                        money: debtor.money,
                        paymentPurpose: `Month payment${dMonth > 1 ? " x" + dMonth : ""}`,
                        debtor: { ...debtor, paymentHistory: [] },
                        moneyPaid: -(debtor.price * dMonth)
                    }

                    debtor.paymentHistory.push(historyItem)
                }
            })
        }

        FirebaseAPI.user.lastUpdate = absoluteNow.getTime()

        await updateDoc(doc(FirebaseAPI.db, 'users', FirebaseAPI.user.uid), { ...FirebaseAPI.user })

        return FirebaseAPI.user
    }

    static async getUser(uid: string): Promise<IUser | null> {
        const resp = await getDoc(doc(FirebaseAPI.db, 'users', uid))

        FirebaseAPI.user = resp.data() as IUser || null

        if (resp.exists()) return FirebaseAPI.updateData()
        else return null
    }

    static async debtorBorrow(debtor: IDebtor, money: number) {
        if (!FirebaseAPI.user) throw Error('You are not authorized')

        const d = FirebaseAPI.user.debtors.find(d => d.name === debtor.name)
        if (!d) throw Error('No such debtor found')

        const now = new Date()

        d.money -= money

        const historyItem: IHistory = {
            date: now.getTime(),
            money: debtor.money,
            debtor: { ...debtor, paymentHistory: [] },
            moneyPaid: -money
        }

        d.paymentHistory.push(historyItem)

        await updateDoc(doc(FirebaseAPI.db, 'users', FirebaseAPI.user.uid), { 'debtors': FirebaseAPI.user.debtors })
        return FirebaseAPI.user
    }

    static async debtorPaid(debtor: IDebtor, money: number) {
        if (!FirebaseAPI.user) throw Error('You are not authorized')

        const d = FirebaseAPI.user.debtors.find(d => d.name === debtor.name)!

        const now = new Date()

        d.money += money

        const historyItem: IHistory = {
            date: now.getTime(),
            money: debtor.money,
            debtor: { ...debtor, paymentHistory: [] },
            moneyPaid: money
        }

        d.paymentHistory.push(historyItem)

        await updateDoc(doc(FirebaseAPI.db, 'users', FirebaseAPI.user.uid), { 'debtors': FirebaseAPI.user.debtors })

        return FirebaseAPI.user
    }

    static getTotalHistory(): IHistory[] {
        if (!FirebaseAPI.user) throw Error('You are not authorized')

        const history: IHistory[] = []

        FirebaseAPI.user.debtors.forEach(debtor => {
            history.push(...debtor.paymentHistory)
        })

        history.sort((a, b) => b.date - a.date)

        return history
    }
}