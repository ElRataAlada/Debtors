import { useContext, useMemo, useState } from "react";
import { AppContext } from "./context/UserContext";
import Header from "./components/Header/Header";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Main from "./components/Main/Main";
import TotalDebt from "./components/Main/TotalDebt/TotalDebt";
import ControlButtons from "./components/Main/ControlButtons/ControlButtons";
import ControlButton from "./components/Main/ControlButtons/ControlButton/ControlButton";
import { MoneyChangeMode } from "./types/app";
import ChangeMoneyPopup from "./components/ChangeMoneyPopup/ChangeMoneyPopup";
import Footer from "./components/Footer/Footer";
import FooterSelector from "./components/Footer/FooterSelector/FooterSelector";
import FooterButton from "./components/UI/FooterButton/FooterButton";
import Loader from "./components/UI/Loader/Loader";
import DebtorItem from "./components/History/DebtorItem/DebtorItem";
import History from "./components/History/History";
import FooterSearch from "./components/Footer/FooterSearch/FooterSearch";
import HistoryItem from "./components/History/HistoryItem/HistoryItem";
import HistoryTimeItem from "./components/History/HistoryItem/HistoryTimeItem/HistoryTimeItem";
import AddDebtorPopup from "./components/AddDebtorPopup/AddDebtorPopup";
import FirebaseAPI from "./API/Firebase";

window.addEventListener('resize', () => {
    if (!window.visualViewport) return

    const vh = window.visualViewport.height
    document.documentElement.style.setProperty('--vh', vh + 'px')
})


function App() {
    const { updateUser, user, selectedDebtor, setSelectedDebtor, history } = useContext(AppContext)

    const [moneyMode, setMoneyMode] = useState<MoneyChangeMode>(MoneyChangeMode.NULL)
    const [isMoneyPopupOpen, setIsMoneyPopupOpen] = useState<boolean>(false)

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isSearchInputOpen, setIsSearchInputOpen] = useState<boolean>(false)

    const [selectedFooterMenuItem, setSelectedFooterMenuItem] = useState<string>('Debtors')

    const [isAddDebtorPopupOpen, setIsAddDebtorPopupOpen] = useState<boolean>(false)

    let prevDate: number | null = null

    const filteredHistory = useMemo(() => {
        return history.filter(item =>
            searchQuery === '' ||
            item.debtor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.moneyPaid.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery, history])

    const [parent] = useAutoAnimate()

    return (
        <>
            <Header Ref={parent} />

            <Main Ref={parent}>
                <TotalDebt />

                <ControlButtons>
                    <ControlButton title="Borrow" img="./img/ico/borrow.svg"
                        onClick={() => { user && setIsMoneyPopupOpen(true); setMoneyMode(MoneyChangeMode.BORROW) }}
                    />
                    <ControlButton title="Receive" img="./img/ico/receive.svg"
                        onClick={() => { user && setIsMoneyPopupOpen(true); setMoneyMode(MoneyChangeMode.RECEIVE) }}
                    />
                </ControlButtons>

                <ChangeMoneyPopup changeMode={moneyMode} isOpen={isMoneyPopupOpen} setIsOpen={setIsMoneyPopupOpen} />

            </Main>

            <Footer Ref={parent}>
                <FooterSearch setQuery={setSearchQuery} query={searchQuery} isInputShown={isSearchInputOpen} setIsInputShown={setIsSearchInputOpen} selectedMenuItem={selectedFooterMenuItem} />

                {
                    selectedFooterMenuItem == 'Debtors' && user &&
                    <>
                        <FooterButton style={{
                            position: 'absolute',
                            top: '10px',
                            right: '20px',
                            height: '32px',
                            padding: '7px',
                            borderRadius: '50%',
                            zIndex: 4,
                            backgroundColor: 'var(--btn-color)'
                        }}
                            onClick={() => { setIsAddDebtorPopupOpen(true) }}
                            selected=""
                        >
                            <img src="./img/ico/add.png" className="white-filter" alt="Add Debtors" />
                        </FooterButton>

                        <FooterButton style={{
                            position: 'absolute',
                            top: '10px',
                            left: '20px',
                            padding: '7px',
                            height: '32px',
                            borderRadius: '50%',
                            zIndex: 4,
                            backgroundColor: 'var(--btn-color)'
                        }}
                            onClick={async () => {
                                if (!selectedDebtor) return
                                const user = await FirebaseAPI.deleteDebtor(selectedDebtor)

                                updateUser(user)

                                setSelectedDebtor(user.debtors[0] || null)
                            }}
                            selected=""
                        >
                            <img src="./img/ico/delete.png" className="white-filter" alt="Add Debtors" />
                        </FooterButton>
                    </>
                }

                {selectedFooterMenuItem == 'Debtors' &&
                    <>
                        {!user ? <Loader size={60} borderSize={10} /> :
                            (user?.debtors.length === 0 ? <p className="footer-info-text">No debtors yet
                                <br />

                                <FooterButton style={{
                                    margin: '10px 0',
                                    height: '40px',
                                    padding: '7px',
                                    borderRadius: '50%',
                                    zIndex: 4,
                                    backgroundColor: 'var(--btn-color)'
                                }}
                                    onClick={() => { setIsAddDebtorPopupOpen(true) }}
                                    selected=""
                                >
                                    <img src="./img/ico/add.png" className="white-filter" alt="Add Debtors" />
                                </FooterButton>

                                <br />
                                to continue
                            </p>
                                :
                                <History Ref={parent}>
                                    {user.debtors
                                        .sort((d1, d2) => d1.name.localeCompare(d2.name))
                                        .map(debtor => <DebtorItem selected={selectedDebtor} debtor={debtor} key={"D_" + debtor.name} />)}
                                </History>
                            )
                        }
                    </>
                }

                {selectedFooterMenuItem == 'History' &&
                    <>
                        {
                            !user ?
                                <Loader size={60} borderSize={10} />
                                :
                                history.length === 0 ? <p className="footer-info-text">No history yet</p> :

                                    <History Ref={parent}>
                                        {filteredHistory.map(item => {
                                            const date = new Date(item.date)
                                            date.setHours(0, 0, 0, 0)

                                            const prev = new Date(prevDate || 0)
                                            prev.setHours(0, 0, 0, 0)

                                            if (date.toLocaleDateString() != prev.toLocaleDateString()) {
                                                prevDate = item.date
                                                return (
                                                    <div key={"T_" + item.date + item.debtor.name}>
                                                        <HistoryTimeItem date={date} />
                                                        <HistoryItem item={item} key={item.date + item.debtor.name} />
                                                    </div>
                                                )
                                            }

                                            return <HistoryItem item={item} key={item.date + item.debtor.name} />
                                        })}
                                    </History>
                        }
                    </>
                }

            </Footer>

            <AddDebtorPopup isOpen={isAddDebtorPopupOpen} setIsOpen={setIsAddDebtorPopupOpen} />

            <FooterSelector>
                <FooterButton selected={selectedFooterMenuItem}
                    onClick={() => { setSelectedFooterMenuItem('History') }}
                    title="History"
                >
                    <img src="./img/ico/history.png" className="white-filter" alt="History" />
                </FooterButton>

                <FooterButton selected={selectedFooterMenuItem}
                    onClick={() => { setSelectedFooterMenuItem('Debtors') }}
                    title="Debtors"
                >
                    <img src="./img/ico/userOutlined.png" className="white-filter" alt="Debtors" />
                </FooterButton>

            </FooterSelector>
        </>
    );
}

export default App;
