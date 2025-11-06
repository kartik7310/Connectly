import { createSlice } from '@reduxjs/toolkit'
export const feedSlice = createSlice({
  name: 'feeds',
  initialState: {
   feed:[]
  },
  reducers: {
    addFeed: (state,actions) => actions.payload,
    removeFeed: (state,actions) =>{
      const newFeed = state.filter((feed)=>feed._id !==actions.payload);
      return newFeed
    }
  },
})


export const {addFeed,removeFeed } = feedSlice.actions

export default feedSlice.reducer