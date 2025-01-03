import { openDB } from 'idb';
import { Board } from '../context/BoardContext';

const DB_NAME = 'TrelloApp';
const DB_VERSION = 1;
const STORE_NAME = 'boards';

// Create or open the database
export const openDatabase = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'name' }); // keyPath is 'name' to ensure unique boards
      store.createIndex('bgcolor', 'bgcolor');
    },
  });
};

// Add a board to IndexedDB
export const addBoardToDB = async (board: Board) => {
  try {
    const db = await openDatabase();
    const existingBoard = await db.get(STORE_NAME, board.name);
    if (existingBoard) {
      // If board already exists, update it
      await db.put(STORE_NAME, board);
    } else {
      // Otherwise, add new board
      await db.add(STORE_NAME, board);
    }
  } catch (error) {
    console.error('Error adding board to DB:', error);
  }
};

// Get all boards from IndexedDB
export const getAllBoardsFromDB = async () => {
  try {
    const db = await openDatabase();
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error('Error getting boards from DB:', error);
    return []; // Return an empty array in case of error
  }
};

// Delete a board from IndexedDB by name
export const deleteBoardFromDB = async (name: string) => {
  try {
    const db = await openDatabase();
    await db.delete(STORE_NAME, name);
  } catch (error) {
    console.error('Error deleting board from DB:', error);
  }
};


// Add a list to a specific board
export const addListToBoard = async (boardName: string, list: any) => {
  try {
    const db = await openDatabase();
    const board = await db.get(STORE_NAME, boardName);
    if (board) {
      board.list.push(list);
      await db.put(STORE_NAME, board);
    }
  } catch (error) {
    console.error('Error adding list to board:', error);
  }
};

// Remove a list from a specific board
export const removeListFromBoard = async (boardName: string, listId: string) => {
  try {
    const db = await openDatabase();
    const board = await db.get(STORE_NAME, boardName);
    if (board) {
      board.list = board.list.filter((l: any) => l.id !== listId);
      await db.put(STORE_NAME, board);
    }
  } catch (error) {
    console.error('Error removing list from board:', error);
  }
};

export const updateListItems = async (boardName: string, listId: string, items: any[]) => {
    try {
      const db = await openDatabase();
      const board = await db.get(STORE_NAME, boardName);
      if (board) {
        const list = board.list.find((l: any) => l.id === listId);
        if (list) {
          list.items = items; // Update the items array
          await db.put(STORE_NAME, board); // Save updated board to DB
        }
      }
    } catch (error) {
      console.error('Error updating list items:', error);
    }
  };
  



// Restore board state from IndexedDB
export const restoreBoardState = async (setAllBoard: any) => {
  try {
    const boards = await getAllBoardsFromDB();
    if (boards.length > 0) {
      setAllBoard({ boards, active: 0 });
    }
  } catch (error) {
    console.error('Error restoring board state:', error);
  }
};



