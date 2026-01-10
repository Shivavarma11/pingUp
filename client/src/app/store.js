import {configureStore} from '@reduxjs/toolkit'
import {userReducer} from "../features/user/usersSlice.js"
import {connectionsReducer} from "../features/connections/connectionsSlice.js"
import {messageReducer} from "../features/messages/messagesSlice.js"

export const store = configureStore({
    reducer:{
        user: userReducer,
        connections : connectionsReducer,
        messages : messageReducer
    }
})