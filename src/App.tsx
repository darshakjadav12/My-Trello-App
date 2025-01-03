import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Main from './components/Main'
import Sidebar from './components/Sidebar'
import { BoardContext, BoardData } from './context/BoardContext'

const App = () => {
  

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
     <Header/>
     <BoardContext.Provider value={{allboard,setAllBoard}}>
     <div className='content flex'>
        <Sidebar/>
        <Main/>
     </div>
     </BoardContext.Provider>
    </>
  )
}

export default App