import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import type { UserData, UserContextData, UserProviderProps } from "../types/user";
import { localStorageKey } from "../constants/localStorageKey";

const userContext = createContext({})

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userData, setUserData] = useState<UserData>({} as UserData)

  const putUserData = (data: UserData) => {
    setUserData(data);

    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }

  const getUserInfo = async (gitHubCode: string) => {
    const { data } = await api.get<UserData>("/auth/callback", {
      params: {
        code: gitHubCode
      }
    })
    console.log(data);

    putUserData(data)
  }

  const loadUserData = () => {
    const data = localStorage.getItem(localStorageKey);
    if (data) {
      setUserData(JSON.parse(data) as UserData);
    }
  }

  useEffect(() => {
    loadUserData();
  }, [])

  const logOut = () => {
    localStorage.removeItem(localStorageKey);
    setUserData({} as UserData);
  }

  return (
    <userContext.Provider value={{ userData, getUserInfo, logOut }}>
      {children}
    </userContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("useUser must be used with useContext");
  }

  return context as UserContextData;
}