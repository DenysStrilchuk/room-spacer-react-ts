import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router';
import { store } from "./store";
import {useAuthListener} from "./hooks/useAuthListener";

const Root = () => {
    useAuthListener();

    return <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <Root />
    </Provider>
);
