import { Edit2, MoreHorizontal, UserPlus } from "react-feather"
import CardAdd from "./CardAdd"
import { useContext,  useEffect,  useState } from "react";
import { BoardContext } from "../context/BoardContext";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import AddLIst from "./AddLIst";
// import Utils from "../utils/Utils";
import { addItemAPI, addListAPI, deleteItemAPI, deleteListAPI, editItemAPI, getBoardIDAPI } from "../api/boardService";


const Main = () => {

  const [editItem, setEditItem] = useState<{ listIndex: number, itemIndex: number } | null>(null);
  const [editText, setEditText] = useState("");
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

const [removeListIndex, setRemoveListIndex] = useState<number | null>(null);
const [removePopupPosition, setRemovePopupPosition] = useState<{ top: number; left: number } | null>(null);


  const context = useContext(BoardContext);

  if (!context) {
    throw new Error('Sidebar must be used within a BoardContext.Provider');
  }

  const { allboard, setAllBoard } = context;

  const bdata  = allboard.boards[allboard.active]
    
  // console.log(bdata); 
  

  async function onDragEnd(res: DropResult) {
    if (!res.destination) {
        console.log("No Destination");
        return;
    }

    const newList = [...bdata.list]; // Clone the list array
    const s_id = parseInt(res.source.droppableId); // Source list ID
    const d_id = parseInt(res.destination.droppableId); // Destination list ID
    

    // Remove the item from the source list
    const [removed] = newList[s_id - 1].items.splice(res.source.index, 1);

    // Add the removed item to the destination list
    newList[d_id - 1].items.splice(res.destination.index, 0, removed);

    // Update the state of the board
    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);

}


//   const cardData = async(e:string,index:number) =>{
//     console.log(e,index);
    
//     let newList = [...bdata.list];
    
//     newList[index].items.push({id:Utils.makeid(5),title:e})

//     let board_  = {...allboard};
//     board_.boards[board_.active].list = newList;
//     setAllBoard(board_);

// }

const cardData = async (title: string, index: number) => {
  
  console.log(bdata);
  

  let newList = [...bdata.list];  

  const listId = newList[index].id; // Get the list ID for the current index

  
  try {

    // Call the API to save the card in the database
    const response = await addItemAPI({
      list_id: listId,
      title: title,
    })

    const newItem = response.item; // Get the saved item from the API response

    // Ensure 'items' is an array
  if (!Array.isArray(newList[index].items)) {
    newList[index].items = [];
  }

    // Update the state with the new item
    newList[index].items.push(newItem);
    

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);    
    
  } catch (error) {
    console.error("Error saving card to database:", error);
  }
};


  const listData = async(e:string) =>{

    const dataID = await getBoardIDAPI(bdata.name);  
    let boardID = dataID.boardId;

    const response =    await addListAPI({
        board_id:boardID,
        title:e
       });  

       const newListFromDB = response.list;  

       let newList = [...bdata.list];
    
      const newListObject = { id: newListFromDB.id , title: e, items: [] };
      newList.push(newListObject);

      newList.map((list) =>{
        list.items = [];
      })

    let board_  = {...allboard};
    board_.boards[board_.active].list = newList;

    
    setAllBoard(board_);    
  }

  const handleRemovePopup = (e: React.MouseEvent, index: number) => {
    const buttonRect = (e.target as HTMLElement).getBoundingClientRect();
    setRemovePopupPosition({ top: buttonRect.bottom, left: buttonRect.left });
    setRemoveListIndex(index);
  };
  

  const removeList = async() => {

    if (removeListIndex !== null) {

      const listToRemove = bdata.list[removeListIndex];      
  
      // Check if the list belongs to the default board
      if (bdata.name === 'My Trello Board' && (listToRemove.id === '1' || listToRemove.id === '2' || listToRemove.id === '3')) {
        alert("This list cannot be deleted from the default board.");
        return;
      }
      
      const listID = listToRemove.id;

      await deleteListAPI( Number(listID))
  
      const newList = [...bdata.list];
      newList.splice(removeListIndex, 1); // Remove the selected list
  
      const board_ = { ...allboard };
      board_.boards[board_.active].list = newList;
      setAllBoard(board_);

      setRemoveListIndex(null); // Close popup
      setRemovePopupPosition(null);
    }
  };

  const removeItem = async () => {
    if (editItem) {
      const list = bdata.list[editItem.listIndex];
      const item = list.items[editItem.itemIndex];
  
      // Check if the item.id is one of the default ones
      if (item.id === '1' || item.id === '2' || item.id === '3') {
        alert("This item cannot be deleted from the default lists.");
        return;
      }
  
      // Remove the item from the list
      list.items.splice(editItem.itemIndex, 1);
  
      // Update the state with the modified list
      const updatedBoard = { ...allboard };
      updatedBoard.boards[updatedBoard.active].list = [...bdata.list];
      setAllBoard(updatedBoard);
  
      // Persist the changes in IndexedDB
     
     await deleteItemAPI(Number(item.id));

  
      // Close the edit popup
      setEditItem(null);
      setPopupPosition(null);
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
        setRemovePopupPosition(null);
        setPopupPosition(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  

  return (
    <>
     <div className="flex flex-col  w-full" style={{backgroundColor:`${bdata.bgcolor}`}}>

        <div className="p-3 bg-black flex justify-between w-full bg-opacity-50">
            <h2 className="text-lg">{bdata.name} </h2>
            <div className="flex items-center justify-center">
               <button className="bg-gray-200 text-gray-800 px-2 py-1 mr-2 rounded h-8
               flex justify-center items-center"><UserPlus size={16} className="mr-2"></UserPlus>Share</button>
               <button className="hover:bg-gray-500 px-2 py-1 h-8 rounded"><MoreHorizontal size={16}></MoreHorizontal></button>
            </div>
        </div>

        <div className="flex flex-col w-full flex-grow relative">
          <div className="absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-scroll ">

            <DragDropContext onDragEnd={onDragEnd}>
                {bdata.list && 
                bdata.list.map((list,index)=>{
                  // console.log('list.id',list.items);  
                  
                return  <div key={index} className="mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0" >
                <div className="list-body">
                    <div className="flex justify-between p-1">
                      <span>{list.title}</span>
                      <button onClick={(e) => handleRemovePopup(e, index)} className="hover:bg-gray-500 p-1 rounded-sm"><MoreHorizontal size={16}></MoreHorizontal></button>
                    </div>

                    <Droppable droppableId={list.id.toString()}>
                      {(provided, snapshot) => (
                        <div className="py-1"
                          ref={provided.innerRef}
                          style={{ backgroundColor: snapshot.isDraggingOver ? '#222' : 'transparent' }}
                          {...provided.droppableProps}>
                            
                          {list.items && 
                          list.items.map((item,itemIndex)=>{
                            // console.log('item.id', item.id);
                          return  <Draggable key={item.id} draggableId={(item.id).toString()} index={itemIndex}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                               <div className="item flex justify-between items-center bg-zinc-700 p-1 cursor-pointer rounded-md border-2 border-zinc-900 
                                   hover:border-gray-500">
                                <span>{item.title  }</span>
                                <span className="flex justify-start items-start">
                                <button    className="hover:bg-gray-600 p-1 rounded-sm" 
                                onClick={(e) => {  const buttonRect = (e.target as HTMLElement).getBoundingClientRect();
                                  setPopupPosition({ top: buttonRect.bottom, left: buttonRect.left });
                                  setEditItem({ listIndex: index, itemIndex });setEditText(item.title);}}><Edit2 size={16}></Edit2></button>
                                </span>

                               </div>
                            </div>
                          )}
                        </Draggable>
                          
                  })}
                        {provided.placeholder}
                      </div>
                   )}
                  </Droppable>
                    <CardAdd getcard={(e) => cardData(e,index)}/>
                </div>
                </div>
                })}
            </DragDropContext>
            <AddLIst getlist={ (e) => listData(e)}/>
              
           
          </div>
        </div>

         {/* Popup for Editing Item */}
         {editItem && popupPosition && (
            <div
              className="popover-container fixed z-50 bg-slate-600 p-4 rounded-md shadow-lg"
             style={{
                position: 'absolute',
               top: popupPosition.top,
               left: popupPosition.left,
                transform: 'translate(-50%, 0)',
             }}
           >
             <textarea
               className="bg-zinc-700 w-full p-2 border rounded"
               value={editText}
                onChange={(e) => setEditText(e.target.value)}
             />
              <div className="flex justify-center mt-1">
               <button
                 className="bg-gray-300 text-black px-2 py-1 rounded mr-2"
        onClick={() => setEditItem(null)} // Cancel Editing
               >
                 Cancel
               </button>
               <button
                 className="bg-sky-700 text-white px-2 py-1 rounded"
                 onClick={async() => {
                   if (editItem) {
                     const newList = [...bdata.list];
                     newList[editItem.listIndex].items[editItem.itemIndex].title = editText;

                     const id  =  newList[editItem.listIndex].items[editItem.itemIndex].id;
                     

                     const board_ = { ...allboard };
                     board_.boards[board_.active].list = newList;
                     setAllBoard(board_);

                    await editItemAPI({id:Number(id),title: editText})

                   }
                   setEditItem(null);
                   setPopupPosition(null); // Close Popup
                 }}
                 >
                 Save
               </button>
               <button
                className="bg-red-600 text-white px-2 py-1 rounded ml-2"
                onClick={removeItem} >Remove
                </button>
             </div>
           </div>
          )}

            
          {/* remove list popup */}
          {removeListIndex !== null && removePopupPosition && (
           <div
              className="popover-container fixed z-50 bg-slate-600 p-4 rounded-md shadow-lg"
              style={{
                position: "absolute",
                top: removePopupPosition.top,
                left: removePopupPosition.left,
                transform: "translate(-50%, 0)",
              }}
            >
              <p className="text-white mb-2">Are you sure you want to remove this list?</p>
              <div className="flex justify-center">
                <button
                  className="bg-gray-300 text-black px-2 py-1 rounded mr-2"
                  onClick={() => {
                   setRemoveListIndex(null);
                   setRemovePopupPosition(null);
                  }}
                >
                  Cancel
               </button>
                <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={removeList}>
                  Remove
                </button>
              </div>
            </div>
          )}


    </div>
    </>
   
  )
}

export default Main