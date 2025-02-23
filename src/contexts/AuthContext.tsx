
import React, { createContext } from 'react';

// Simplified context without auth requirements
interface AuthContextType {
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    loading: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
