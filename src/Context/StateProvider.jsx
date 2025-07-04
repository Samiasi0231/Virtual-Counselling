// state/StateProvider.js
import React, { createContext, useContext, useReducer } from "react";

// Create the context
export const StateContext = createContext();

// Create the provider
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// Custom hook for cleaner access
export const useStateValue = () => useContext(StateContext);



