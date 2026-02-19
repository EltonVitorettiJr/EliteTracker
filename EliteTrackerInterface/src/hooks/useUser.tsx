import { createContext, useContext, useEffect, useState } from "react";
import { localStorageKey } from "../constants/localStorageKey";
import api from "../services/api";
import type {
  UserContextData,
  UserData,
  UserProviderProps,
} from "../types/user";

const userContext = createContext({});

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<UserData>({} as UserData);

  const putUserData = (data: UserData) => {
    setUserData(data);

    localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  const getUserInfo = async (gitHubCode: string) => {
    const { data } = await api.get<UserData>("/auth/callback", {
      params: {
        code: gitHubCode,
      },
    });
    console.log(data);

    putUserData(data);
  };

  const loadUserData = () => {
    const data = localStorage.getItem(localStorageKey);
    if (data) {
      setUserData(JSON.parse(data) as UserData);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Falso positivo do biome, não é necessário que a função seja uma dependência do useEffect>
  useEffect(() => {
    loadUserData();
  }, []);

  const logOut = () => {
    localStorage.removeItem(localStorageKey);
    setUserData({} as UserData);
  };

  return (
    <userContext.Provider value={{ userData, getUserInfo, logOut }}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("useUser must be used with useContext");
  }

  return context as UserContextData;
};
