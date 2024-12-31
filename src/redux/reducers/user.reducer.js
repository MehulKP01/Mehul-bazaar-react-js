import { createSlice } from "@reduxjs/toolkit";

var initialState = {
    isAuthenticated: false,
    isGuest: false,
    userId: null,
    user: null,
    error: null,
    loading: true,
    addresses: [],
    adduseraddress: [],
    editaddress: [],
    saveaddress: [],
    newsLetter: false,
    updateProfile: {},
    userprofile: null,
    paymentAddress:{},
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            // console.log("reducer",action.payload.isGuest)
            state.isAuthenticated = true;
            state.isGuest = JSON.parse(action.payload.isGuest);
            state.userId = action.payload.userId;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            state.loading = false;
            // console.log("_payload_", action.payload);
        },

        loginFailure: (state, action) => {
            state.isAuthenticated = false;
            state.user = null;
            //state.token = null;
            state.error = action.payload;
            state.loading = false;
            //
            state.userId = null;
            state.user = null;
            state.error = null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.error = null;
            //state.token = null;
            state.isGuest = true;
            state.loading = false;
        },
        setUseProfile: (state, action) => {
            state.userprofile = action.payload;
        },
        setAddress: (state, action) => {
            state.addresses = action.payload;
        },
        addAddress: (state, action) => {
            state.adduseraddress = action.payload;
        },
        saveuseraddress: (state, action) => {
            state.saveaddress = action.payload;
        },
        usereditaddress: (state, action) => {
            state.editaddress = action.payload;
        },
        newsLetters: (state, action) => {
            state.newsLetter = action.payload.status;
        },
        updateUserProfile: (state, action) => {
            state.updateProfile = action.payload;
        },
        setPaymentAddress:(state,action)=>{
            state.paymentAddress = action?.payload
        }
    },
});

export const {
    loginSuccess,
    loginFailure,
    logout,
    setUseProfile,
    setAddress,
    addAddress,
    saveuseraddress,
    usereditaddress,
    newsLetters,
    updateUserProfile,
    setPaymentAddress,
} = userSlice.actions;

export default userSlice.reducer;
