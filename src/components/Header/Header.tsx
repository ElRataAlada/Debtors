import { useContext } from 'react'
import styles from './Header.module.scss'
import FirebaseAPI from '../../API/Firebase'
import { AppContext } from '../../context/UserContext'

export default function Header({ Ref }: { Ref: React.LegacyRef<HTMLDivElement> }) {
    const { user, updateUser } = useContext(AppContext)

    return (
        <header className={styles.header}>
            <div ref={Ref} className={styles.header_inner}>
                <img className={styles.user + ` ${!user && 'white-filter'}`} src={user?.photoUrl || "./img/ico/user.png"} alt="user" />

                {
                    user ?
                        <div className={styles.name}>
                            <p>Welcome,</p>
                            <h2>{user.name}</h2>
                        </div>
                        :
                        <div className={[styles.name, styles.logout].join(' ')}>
                            <p>Welcome, please</p>
                        </div>
                }

                {user ?
                    <button type='button' className={styles.login} onClick={async () => {
                        const user = await FirebaseAPI.logOut()
                        updateUser(null)
                    }}>
                        Log out
                    </button>
                    :
                    <>
                        <button type='button' className={[styles.login, styles.logout].join(' ')} onClick={async () => {
                            const user = await FirebaseAPI.logIn()
                            updateUser(user)
                        }}>
                            Log in
                        </button>
                        to continue
                    </>
                }
            </div>

        </header>
    )
}
