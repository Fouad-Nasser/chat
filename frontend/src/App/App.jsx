import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Chats from '../Pages/Chats/Chats';
import Register from '../Pages/Register/Register';
import Login from '../Pages/Login/Login';
import NotFound from '../Pages/NotFound/NotFound';
import { ChatState } from '../Context/ChatProvider';


function App() {
  const { user } = ChatState();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
            user?
            <Navigate to="/chats"/>:
            <Navigate to="/login"/>
          } exact/>

        <Route path="/login" element={
            user?
            <Navigate to="/chats"/>:
            <Login/>
          }/>

        <Route path="/register" element={
             user?
              <Navigate to="/chats"/>:
              <Register/>
          }/>

        <Route path="/chats" element={
            user?
            <Chats/>:
            <Navigate to="/login"/>
          }/>

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </div>
  );
}

export default App;
