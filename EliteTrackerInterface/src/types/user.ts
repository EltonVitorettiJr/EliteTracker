import type { ReactNode } from "react";

export interface UserData {
  id: string;
  name: string;
  avatarUrl: string;
  token: string;
}

export interface UserContextData {
  userData: UserData;
  getUserInfo: (gitHubCode: string) => Promise<void>;
  logOut: () => void;
}

export interface UserProviderProps {
  children: ReactNode;
}
