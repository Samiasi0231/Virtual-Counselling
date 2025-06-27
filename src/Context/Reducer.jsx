export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STUDENT":
      return {
        ...state,
        student: {
          ...action.payload.user,
          user_type: action.payload.user_type, 
        },
        studentToken: action.payload.token,
      };

    case "SET_COUNSELLOR":
      return {
        ...state,
        counsellor: {
          ...action.payload.user,
          user_type: action.payload.user_type
        },
        counsellorToken: action.payload.token,
      };

    case "LOGOUT":
      return {
        ...state,
        student: null,
        studentToken: null,
        counsellor: null,
        counsellorToken: null,
      };

    default:
      return state;
  }
};


// export const studentAuthReducer = (state, action) => {
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
