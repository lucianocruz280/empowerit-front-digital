import React, { createContext, useContext, useState } from 'react';

// Creamos el contexto de usuario
const UserContext = createContext();

// Creamos un custom hook para acceder al contexto más fácilmente
export const useUserContext = () => {
  return useContext(UserContext);
};

// Creamos el proveedor del contexto que contendrá el estado del usuario y las funciones para actualizarlo
export const UserProvider = ({ children }) => {
  const [user, setUserLogged] = useState({
    uid: '',
    avatar: '',
    name: '',
    email: '',
    authority: [],
  });

  return (
    <UserContext.Provider value={{ user, setUserLogged }}>
      {children}
    </UserContext.Provider>
  );
};