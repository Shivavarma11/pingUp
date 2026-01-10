import { createSlice } from "@reduxjs/toolkit";

const initialState={
    connections:[],
    pendingConnections:[],
    followers:[],
    follwing:[]
}

const connectonsSlice=createSlice({
    name : 'connections',
    initialState,
    reducers:{

    }
})

export default connectonsSlice.reducer