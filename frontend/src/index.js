import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap/dist/react-bootstrap';
import {BrowserRouter} from 'react-router-dom';
import ThemeProvider from 'react-bootstrap/ThemeProvider'
import ChatProvider from './Context/ChatProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
    <ChatProvider>
    <ThemeProvider
      breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
      minBreakpoint="xxs"
    >
      <App />
      </ThemeProvider>
      </ChatProvider>
    </React.StrictMode>
  </BrowserRouter>
);


