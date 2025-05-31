import React from 'react';
import { Routes, Route, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import routes from './routes';
const App = () => {
    const element = useRoutes([
        ...routes
    ]);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {element}
            </PersistGate>
        </Provider>
    );
};

export default App;
