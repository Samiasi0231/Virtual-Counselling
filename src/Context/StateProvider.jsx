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



// import {reducer}  from "./Reducer"
// import{initialState} from "./InitialState"
// const studentAuthReducer = (state, action) => {
//   switch (action.type) {
//     case "SET_STUDENT":
//       localStorage.setItem("STUDENT_OBJECT", JSON.stringify(action.payload.student));
//       localStorage.setItem("STUDENT_TOKEN", action.payload.token);
//       return {
//         ...state,
//         student: action.payload.student,
//         token: action.payload.token,
//       };

//     case "LOGOUT_STUDENT":
//       localStorage.removeItem("STUDENT_OBJECT");
//       localStorage.removeItem("STUDENT_TOKEN");
//       return {
//         ...state,
//         student: null,
//         token: null,
//       };

//     default:
//       return state;
//   }
// };

// // Create context
// const StudentAuthContext = createContext();

// // Provider
// export const StudentAuthProvider = ({ children }) => {
// const [state, dispatch] = reducer(studentAuthReducer, initialState);


//   return (
//     <StudentAuthContext.Provider value={{ state, dispatch }}>
//       {children}
//     </StudentAuthContext.Provider>
//   );
// };

// // Custom hook
// export const useStudentAuth = () => useContext(StudentAuthContext);