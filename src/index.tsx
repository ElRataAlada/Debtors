import ReactDOM from 'react-dom/client';
import './scss/index.scss';
import App from './App';
import { UserContext } from './context/UserContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <UserContext>
        <App />
    </UserContext>
);