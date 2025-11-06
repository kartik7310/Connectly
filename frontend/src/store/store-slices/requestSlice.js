import { createSlice } from '@reduxjs/toolkit'
export const requestSlice = createSlice({
  name: 'request',
  initialState: {
   request:[]
  },
  reducers: {
    addRequest: (state,actions) => actions.payload,
    removeRequest: (state,actions) =>{
      const newArray = state.filter((req)=>req._id !==actions.payload);
      return newArray;
    }
  },
})


export const {addRequest,removeRequest } = requestSlice.actions

export default requestSlice.reducer