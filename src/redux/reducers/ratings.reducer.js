const { createSlice } = require("@reduxjs/toolkit")


let initialState = {
    activeKeys:"",
    activeUsers:"",
    expireKeys:"",
    resellers:"",
    totalKeys:"",
    unusedKeys:"",
    users:"",
}


const ratingSlice = createSlice({
    name:"globalRatings",
    initialState,
    reducers:{
        setGlobalRatings:(state,action) => {
            state.activeKeys = action?.payload?.activeKeys
            state.activeUsers = action?.payload?.activeUsers
            state.expireKeys = action?.payload?.expireKeys
            state.resellers = action?.payload?.resellers
            state.totalKeys = action?.payload?.totalKeys
            state.unusedKeys = action?.payload?.unusedKeys
            state.users = action?.payload?.users
        }
    }
})

export const {setGlobalRatings} = ratingSlice.actions;
export default ratingSlice.reducer; 