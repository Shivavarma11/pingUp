import {createSlice} from '@reduxjs/toolkit'

const initialState ={
    messages :[]
}

const messageSlice = createSlice({
    name : 'messages',
    initialState,
    reducers:{

    }
})


export default messageSlice.reducer