export const studentInitialState = {
  student: JSON.parse(localStorage.getItem("STUDENT_OBJECT")) || null,
  token: localStorage.getItem("STUDENT_TOKEN") || null,
};