import React from 'react';
import { StateProvider } from './Context/StateProvider';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';
import App from './App';
import { initialState} from './Context/InitialState';
import { reducer } from './Context/Reducer';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
