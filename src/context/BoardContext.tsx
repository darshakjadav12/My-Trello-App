import { createContext } from "react";

export interface BoardItem {
    id: string;
    title: string;
  }
  
  export interface BoardList {
    id: string;
    title: string;
    items: BoardItem[];
  }
  
  export interface Board {
    name: string;
    bgcolor: string;
    list: BoardList[];
  }
  
  export interface BoardData {
    active: number;
    boards: Board[];
  }

  export interface BoardContextType {
    allboard: BoardData;
    setAllBoard: React.Dispatch<React.SetStateAction<BoardData>>;
  }

export const BoardContext = createContext<BoardContextType | null>(null);

