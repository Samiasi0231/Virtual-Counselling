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

 