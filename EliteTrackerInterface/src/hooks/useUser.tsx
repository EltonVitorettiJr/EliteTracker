import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../../services/api";

interface UserData {
  id: string;
  name: string;
  avatarUrl: string;
  token: string;
}

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  userData: UserData;
  getUserInfo: (gitHubCode: string) => Promise<void>;
}

const { VITE_LOCAL_STORAGE_KEY } = import.meta.env;

export const localStorageKey = `${VITE_LOCAL_STORAGE_KEY}:user-data`;

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

  return (
    <userContext.Provider value={{ userData, getUserInfo }}>
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