export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("USER_ACCESS_TOKEN"));
  const [userType, setUserType] = useState(() => localStorage.getItem("user_type"));

  const login = ({ token, user_type }) => {
    localStorage.setItem("USER_ACCESS_TOKEN", token);
    localStorage.setItem("user_type", user_type);
    setToken(token);
    setUserType(user_type);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ token, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
