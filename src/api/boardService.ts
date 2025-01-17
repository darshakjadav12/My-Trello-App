import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL ,
});

// Add a request interceptor to include the token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage or context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

// Add a new board
export const addBoardAPI = async (board: { name: string; bgcolor: string}) => {
    const response = await API.post('/addboards', board);
    return response.data;
  };

// Get all boards
export const getBoardsAPI = async () => {
    const response = await API.get('/getBoards');    
    return response.data;
  };


  // Get all boards ID
export const getBoardIDAPI = async (boardName:string) => {
    const response = await API.post('/getBoardID', {boardName:boardName});    
    return response.data;
  };


  export const addListAPI = async ( data: { board_id: number; title: string}) => {
    const response = await API.post('/addLists',data);    
    return response.data;
  };

  export const addItemAPI = async ( data: { list_id: string,  title: string}) => {
    const response = await API.post('/addItems',data);    
    return response.data;
  };

  export const deleteBoardAPI = async (boardId: number) => {
    const response = await API.delete(`/deleteBoard/${boardId}`);
    return response.data;
  };

  export const editBoardAPI = async (data: {id:number,name:string,bgcolor:string}) => {
    const response = await API.put(`/editBoard`,data);
    return response.data;
  };

  export const deleteListAPI = async (id:number) => {
    const response = await API.delete(`/deleteList/${id}`,);
    return response.data;
  };
  

  export const deleteItemAPI = async (id:number) => {
    const response = await API.delete(`/deleteItem/${id}`,);
    return response.data;
  };


  export const editItemAPI = async (data:{id:number,title:string}) => {
    const response = await API.put(`/editItem`,data);
    return response.data;
  };
