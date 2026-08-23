


// import React, { createContext, useContext, useEffect, useState } from "react";
// import { loginUser } from "../services/api";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");

//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = async (username, password) => {
//     try {
//       const response = await loginUser(username, password);

//       const { access, refresh, role, username: userName } = response.data;

//       const userData = {
//         username: userName,
//         role,
//       };

//       localStorage.setItem("access_token", access);
//       localStorage.setItem("refresh_token", refresh);
//       localStorage.setItem("user", JSON.stringify(userData));

//       setUser(userData);

//       return response.data;
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("user");

//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };



import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Correct way: pass object
      const response = await loginUser({ username, password });

      const { access, refresh, role, username: userName } = response.data;

      const userData = { username: userName, role };

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);