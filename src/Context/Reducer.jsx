

export const studentAuthReducer = (state, action) => {
  switch (action.type) {
    case "SET_STUDENT":
      localStorage.setItem("STUDENT_OBJECT", JSON.stringify(action.payload.student));
      localStorage.setItem("STUDENT_TOKEN", action.payload.token);
      return {
        ...state,
        student: action.payload.student,
        token: action.payload.token,
      };

    case "LOGOUT_STUDENT":
      localStorage.removeItem("STUDENT_OBJECT");
      localStorage.removeItem("STUDENT_TOKEN");
      return {
        ...state,
        student: null,
        token: null,
      };

    default:
      return state;
  }
};
