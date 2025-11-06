import { createSlice } from '@reduxjs/toolkit'
export const connectionSlice = createSlice({
  name: 'connection',
  initialState: {
   connection:[]
  },
  reducers: {
    addConnection: (state,actions) => actions.payload,
    removeConnection: (state,actions) =>null,
  },
})


export const {addConnection,removeConnection } = connectionSlice.actions

export default connectionSlice.reducer