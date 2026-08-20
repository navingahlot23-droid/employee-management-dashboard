"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (name: string, email: string, password: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("employeeDashboardUser");
    const storedAuth = localStorage.getItem("employeeDashboardAuth");

    if (storedUser && storedAuth === "true") {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const signup = (
    name: string,
    email: string,
    password: string
  ): boolean => {
    const existingUser = localStorage.getItem("employeeDashboardUser");

    if (existingUser) {
      return false;
    }

    const newUser: User = {
      name,
      email,
      password,
    };

    localStorage.setItem(
      "employeeDashboardUser",
      JSON.stringify(newUser)
    );

    return true;
  };

  const login = (email: string, password: string): boolean => {
    const storedUser = localStorage.getItem("employeeDashboardUser");

    if (!storedUser) {
      return false;
    }

    const parsedUser: User = JSON.parse(storedUser);

    if (
      parsedUser.email === email &&
      parsedUser.password === password
    ) {
      setUser(parsedUser);
      localStorage.setItem("employeeDashboardAuth", "true");

      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("employeeDashboardAuth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}