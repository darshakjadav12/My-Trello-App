import { useState } from "react"
import { Plus, X } from "react-feather"

interface AddListProps {
    getlist: (card: string) => void; // Type for the getcard prop
  }

const AddList = (props:AddListProps) => {

    const [list, setList] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    const saveList = () =>{
        
        if (!list) {
            return;
        }
        props.getlist(list);
        setList('');
        setShow(!show);
    }

    const closeBtn = () =>{
        setList('');
        setShow(!show);
    }


  return (
    <>
    <div>
    <div className="flex flex-col h-fit flex-shrink-0 mr-3 w-60 rounded-md p-2 bg-black">
        { show && <div>
            <textarea value={list} onChange={(e)=>setList(e.target.value)} className="p-1 w-full rounded-md border-2 bg-zinc-700 border-zinc-900" 
            name="" id="" cols={24.5} rows={2}
             placeholder="Enter Card Title......"></textarea>
            <div className="flex p-1">
                <button onClick={()=>saveList()} className="p-1 rounded bg-sky-700 text-white mr-2" >Add List</button>
                <button onClick={() => closeBtn()} className="p-1 rounded hover:bg-gray-600"><X size={16}></X></button>
            </div>
        </div>}
        {!show && <button onClick={() => setShow(!show)} className="flex p-1 w-full justify-center rounded items-center mt-1 hover:bg-gray-500 h-8">
            <Plus size={16}></Plus> Add a List 
        </button>}
    </div>
    </div>
    
    </>
  )
}

export default AddList