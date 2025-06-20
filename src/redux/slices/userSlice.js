import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedin: false,
  user: null,
  token: null,
  error: null,
  usersList: [] ,
  admin: null
  
};

const userSlice = createSlice({
  name: 'users',
 
  initialState,
  reducers: {
    setLoginStatus: (state, action) => {
      state.isLoggedin = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedin = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addToUsersList: (state, action) => {
      if (!state.usersList) state.usersList = [];  // Ensure usersList exists
      state.usersList.push(action.payload);
    },
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    logout: (state) => {
      state.isLoggedin = false;
      state.user = null;
      state.token = null;
      state.error = null;
    }
  },
});

export const { 
  setLoginStatus, 
  setUser, 
  setToken, 
  setError, 
  logout,
  addToUsersList,
  setUsersList
} = userSlice.actions;

export default userSlice.reducer;