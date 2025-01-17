import { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, X } from "react-feather";
import { Popover } from "react-tiny-popover";
import board from '../assets/board.png';
import { BoardContext, BoardList } from "../context/BoardContext";
import { addBoardAPI, deleteBoardAPI, editBoardAPI, getBoardIDAPI, getBoardsAPI } from "../api/boardService";

const Sidebar = () => {

   interface BlankBoard {
    name: string;
    bgcolor: string;
    list: BoardList[]
  }

  const blankboard:BlankBoard ={
    name: '',
    bgcolor: '#FF0000',
    list: []
  }


  const [boardData, setBoarddata] = useState<BlankBoard>(blankboard);

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showpop,setShowpop ] = useState<boolean>(false);

  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  const [editBoardIndex, setEditBoardIndex] = useState<number | null>(null);




  const context = useContext(BoardContext);

  if (!context) {
    throw new Error('Sidebar must be used within a BoardContext.Provider');
  }

  const { allboard, setAllBoard } = context;

  // Fetch boards on mount
  // useEffect(() => {
  //   console.log('ffds');
    
  //   const fetchBoards = async () => {
  //     try {
  //       const data = await getBoardsAPI();
  //       console.log(data.boards, 'fetched boards');     
        
        
  //       // Flatten the boards array correctly
  //       let newB = [...allboard.boards, ...data.boards];  // Spread the elements of data.boards
        
  //       console.log(newB, 'updated boards list');
        
  //       const updatedAllBoard = { ...allboard, boards: newB };
  //       setAllBoard(updatedAllBoard);
        
  //     } catch (error) {
  //       console.error("Failed to fetch boards:", error);
  //     }
  //   };
  //   fetchBoards();
  // }, []);

  useEffect(() => {
    const fetchBoards = async () => {
      try {

        const data = await getBoardsAPI();

          // Filter only the necessary properties: name, bgcolor, and lists
      const updatedBoards = data.boards.map((board: any) => ({
        name: board.name,
        bgcolor: board.bgcolor,
        list: board.list, // Assuming lists is already the required array structure
      }));

      const uniqueBoards = [
        ...allboard.boards,
        ...updatedBoards.filter(
          (newBoard: any) =>
            !allboard.boards.some(
              (existingBoard: any) => existingBoard.name === newBoard.name
            )
        ),
      ];

        // console.log(uniqueBoards, "updated boards list");
        setAllBoard({ ...allboard, boards: uniqueBoards });
      } catch (error) {
        console.error("Failed to fetch boards:", error);
      }
    };
    fetchBoards();
  }, []);
  
  
  
  const setActiveBoard = (index : number) => {
    
      let newboard ={...allboard};
      newboard.active = index;
      
      setAllBoard(newboard);
  }

  const addBoard = async() => {
    try {      
      if (editBoardIndex !== null) {

        let updatedBoards = [...allboard.boards];    
        
        // Get the board ID to delete
         const boardname = updatedBoards[editBoardIndex].name;
         const dataID = await getBoardIDAPI(boardname);  
         let boardID = dataID.boardId;             
        
        updatedBoards[editBoardIndex] = { ...boardData };
          
        const updatedAllBoard = { ...allboard, boards: updatedBoards };
        
        const newName  = updatedAllBoard.boards[editBoardIndex].name;
        const newbgColor = updatedAllBoard.boards[editBoardIndex].bgcolor;


        await editBoardAPI({
          id:boardID,
          name:newName,
          bgcolor:newbgColor
        })
  
        setAllBoard(updatedAllBoard);

        setOpenPopoverIndex(null)
      } else {

        // let newB = [...allboard.boards, boardData];
        // const updatedAllBoard = { ...allboard, boards: newB };
        // setAllBoard(updatedAllBoard);

        await addBoardAPI({
          name: boardData.name,
          bgcolor: boardData.bgcolor,
        }); // Only send the required fields

        let newB = [...allboard.boards, boardData];
        const updatedAllBoard = { ...allboard, boards: newB };
        setAllBoard(updatedAllBoard);

      }
      setBoarddata(blankboard);
      setEditBoardIndex(null);
      setShowpop(!showpop);
    } catch (error) {
      console.error("Failed to add/update board:", error);
    }
  };



  const removeBoard = async(index: number) => {
    if (index === 0 && allboard.boards[0].name === 'My Trello Board') {
      alert("The default board cannot be deleted.");
      return;
    }

     // Get the board ID to delete
     const boardname = allboard.boards[index].name;

     const dataID = await getBoardIDAPI(boardname);  
     let boardID = dataID.boardId;

    try {

     await deleteBoardAPI(boardID);

    const updatedBoards = allboard.boards.filter((_, idx) => idx !== index);
    const updatedAllBoard = { ...allboard, boards: updatedBoards };

    if (allboard.active === index) {
      updatedAllBoard.active = updatedBoards.length > 0 ? 0 : -1;
    }

    setAllBoard(updatedAllBoard);
    setOpenPopoverIndex(null);
    } catch (error) {
      console.error('Failed to delete board:', error);
    }
  };

  const startEditBoard = (index: number) => {
    const selectedBoard = allboard.boards[index];

    try {
    //    // Get the board ID to delete
    //  const boardname = selectedBoard.name;
    //  const dataID = await getBoardIDAPI(boardname);  
    //  let boardID = dataID.boardId;
    //  console.log(boardID);

    if (selectedBoard.name === 'My Trello Board') {
      alert("The default board cannot be edited.");
      return;
    }

    setEditBoardIndex(index);
    setBoarddata(selectedBoard);    
    setShowpop(true);

    } catch (error) {
      console.error('Failed to edit board:', error);
    }
  };

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // Check if the click is outside any of the popovers
    const popovers = document.querySelectorAll('.popover-container');
    const isClickOutside = Array.from(popovers).every(
      (popover) => !popover.contains(event.target as Node)
    );

    if (isClickOutside) {
      setOpenPopoverIndex(null); // Close the popover
      setShowpop(showpop)
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);



  return (
    <>
    <div className={`bg-[#121417] h-[calc(100vh-3rem)] border-r border-r-[#9fadbc29]  flex-shrink-0
      transition-all ease-linear duration-75 
       ${collapsed ? `w-[40px]` : `w-[280px]`}`} >

      { collapsed && <div className="p-2">
            <button onClick={() => setCollapsed(!collapsed)} className="hover:bg-slate-600 p-1 rounded-sm">
                <ChevronRight size={18}></ChevronRight>
            </button>
        </div>}


      { !collapsed && <div>
          <div className="workspace p-3 flex justify-between border-r border-r-[#9fadbc29] ">
            <h4>Trello WorkSpace</h4>
              <button onClick={() => setCollapsed(!collapsed)} className="hover:bg-slate-600 p-1 rounded-sm">
                <ChevronLeft size={18}></ChevronLeft>
              </button>
          </div>

          <div className="boardlist"> 
              <div className="flex justify-between px-3 py-2" >
                  <h6>Your Board</h6>
            
                  <Popover
                      isOpen={showpop}
                      align="start"
                        positions={['right','top', 'bottom', 'left', ]} // preferred positions by priority
                        content={
                        <div className="popover-container ml-2 p-2 w-60 flex flex-col justify-center items-center bg-slate-600 text-white rounded">
                              <button  onClick={() => setShowpop(!showpop)} className="absolute right-2 top-2 hover:bg-gray-500 p-1 rounded">
                                <X size={16}></X></button>
                              <h4 className="py-3">Create Board</h4>
                              <img src={board} alt="sorry" width="200px"  />
                              <div className="mt-3 flex flex-col items-start w-full">
                                  <label htmlFor="title">Board Title <span>*</span></label>
                                  <input value={boardData.name} onChange={(e)=>setBoarddata({...boardData, name: e.target.value})} type="text" className="mb-2 h-8 px-2 w-full bg-gray-700 "  />

                                  <label htmlFor="color">Board Color <span>*</span></label>
                                  <input value={boardData.bgcolor} onChange={(e)=>setBoarddata({...boardData, bgcolor : e.target.value})} type="color" className="mb-2 h-8 px-2 w-full bg-gray-700"  />

                                  <button onClick={()=> addBoard()} className="w-full rounded h-8 bg-slate-700 mt-2 
                                   hover:bg-gray-500">Create</button>
                              </div>
                        </div>} >
                   
                    <button onClick={() => setShowpop(!showpop)} className="hover:bg-slate-600 p-1 rounded-sm">
                    <Plus size={16}></Plus>
                    </button>

                  </Popover>

              </div>
          </div>

          <ul>
            {
              allboard.boards && allboard.boards.map((data,index)=>{
                const isOpen = openPopoverIndex === index;
             return  <li key={index}>
              <div className="flex justify-between px-3 py-2">
               
                  <button onClick={() => setActiveBoard(index)} className="px-3 py-2 w-full text-sm flex justify-start align-baseline hover:bg-gray-500">
                  <span className="w-6 h-max rounded-sm mr-2" style={{backgroundColor : `${data.bgcolor}`}}>&nbsp;</span>
                  <span>{data.name}</span>
                  </button>

                  <Popover
                      isOpen={isOpen}
                      align="start"
                        positions={['right','top', 'bottom', 'left', ]} // preferred positions by priority
                        content={
                        <div className=" popover-container ml-2 p-2 w-60 flex flex-col justify-center items-center bg-slate-600 text-white rounded">
                              <button  onClick={() => setOpenPopoverIndex(null)} className="absolute right-1 top-1 hover:bg-gray-500 p-1 rounded">
                                <X size={16}></X></button>
                              <div className="mt-3 flex flex-row items-start w-full">
                                  <button onClick={()=> removeBoard(index)}  className="w-full rounded h-8 bg-red-600 text-white mt-2 mr-2
                                   hover:bg-red-500">Remove</button>
                                   <button onClick={() => startEditBoard(index)} className="w-full rounded h-8 bg-sky-700  text-white mt-2 
                                   hover:bg-sky-600">Edit</button>
                              </div>
                        </div>} >
                   
                        <button  onClick={() => setOpenPopoverIndex(openPopoverIndex === index ? null : index)}  className="hover:bg-gray-500 px-2 py-1 h-8 rounded"><MoreHorizontal size={16}></MoreHorizontal></button>

                  </Popover>
              </div>
            </li>

              })
            }
          </ul>

        </div>}

    </div>
    </>
  )
}

export default Sidebar