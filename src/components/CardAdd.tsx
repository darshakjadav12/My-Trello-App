import { useState } from "react"
import { Plus, X } from "react-feather"

interface CardAddProps {
    getcard: (card: string) => void; // Type for the getcard prop
  }

const CardAdd = (props:CardAddProps) => {

    const [card, setCard] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    const saveCard = () =>{
        if (!card) {
            return;
        }
        props.getcard(card);
        setCard('');
        setShow(!show);
    }

    const closeBtn = () =>{
        setCard('');
        setShow(!show);
    }


  return (
    <>
    <div>
    <div className="flex flex-col">
        { show && <div>
            <textarea value={card} onChange={(e)=>setCard(e.target.value)} className="p-1 w-full rounded-md border-2 bg-zinc-700 border-zinc-900" name="" id="" cols={24.5} rows={2}
             placeholder="Enter Card Title......"></textarea>
            <div className="flex p-1">
                <button onClick={()=>saveCard()} className="p-1 rounded bg-sky-700 text-white mr-2" >Add Card</button>
                <button onClick={() => closeBtn()} className="p-1 rounded hover:bg-gray-600"><X size={16}></X></button>
            </div>
        </div>}
        {!show && <button onClick={() => setShow(!show)} className="flex p-1 w-full justify-start rounded items-center mt-1 hover:bg-gray-500 h-8">
            <Plus size={16}></Plus> Add a Card 
        </button>}
    </div>
    </div>
    
    </>
  )
}

export default CardAdd