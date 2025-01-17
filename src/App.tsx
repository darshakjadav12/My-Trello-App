import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import Main from './components/Main'
import Sidebar from './components/Sidebar'
import { BoardContext, BoardData } from './context/BoardContext'


import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Check if the user is logged in from local storage or token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token on logout
    setIsLoggedIn(false);
  };


  const boardData: BoardData  = {
    active: 0,
    boards: [
      {
        name:'My Trello Board',
        bgcolor:'#069000',
        list:[
          {id:"1",title:"To do",items:[{id:"1",title:"Project Description 1"}]},
          {id:"2",title:"In Progress",items:[{id:"2",title:"Project Description 2"}]},
          {id:"3",title:"Done",items:[{id:"3",title:"Project Description 3"}]}
        ]
      }
    ]
  }

  const [allboard, setAllBoard] = useState<BoardData>(boardData);


  return (
    <>
    <Router>
        <Routes>
              {!isLoggedIn ? (
                <>
                 <Route path="*" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<Login onLogin={handleLogin} />} />
                  <Route path="/register" element={<Register />} />
                </>
                ) : (
                <>
                  <Route path="*" element={<Navigate to="/home" />} />
                  <Route path="/home" element={
                   <>
                  <Header onLogout={handleLogout} />
                  <BoardContext.Provider value={{allboard,setAllBoard}}>
                  <div className='content flex'>
                    <Sidebar/>
                    <Main/>
                 </div>
                 </BoardContext.Provider>
                   </>
                  } />
                </>)}
        </Routes>
    </Router>
    </>
  )
}

export default App