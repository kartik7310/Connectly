import { createSlice } from '@reduxjs/toolkit'
export const feedSlice = createSlice({
  name: 'feeds',
  initialState: {
   feed:[]
  },
  reducers: {
    addFeed: (state,actions) => actions.payload,
    removeFeed: (state,actions) =>null,
  },
})


export const {addFeed,removeFeed } = feedSlice.actions

export default feedSlice.reducer