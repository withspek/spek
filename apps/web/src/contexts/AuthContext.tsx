"use client";

import React, { createContext } from "react";
import { User } from "@spek/client";
import { useQuery } from "react-query";

type ContextData = {
  user: User | null;
  setUser: (u: User) => void;
};

const AuthContext = createContext<ContextData>({
  setUser: (u: User) => {},
  user: null,
});

export default AuthContext;

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const { data, isLoading } = useQuery<{ user: User }>("/user/me");

  if (isLoading) {
    return <div>loading..</div>;
  }
  return (
    <AuthContext.Provider
      value={{ user: data?.user as any, setUser: () => {} }}
    >
      {children}
    </AuthContext.Provider>
  );
};
