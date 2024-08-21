import React, { Dispatch, SetStateAction, useMemo, useState } from "react";

type Data = { userId: string | null };

interface UserPreviewContextType {
  data: Data | undefined;
  setData: Dispatch<SetStateAction<Data | undefined>>;
}

export const UserPreviewContext = React.createContext<UserPreviewContextType>({
  data: { userId: null },
  setData: () => {},
});

interface UserPreviewContextProviderProps {
  children?: React.ReactNode;
}

export const UserPreviewContextProvider: React.FC<
  UserPreviewContextProviderProps
> = ({ children }) => {
  const [data, setData] = useState<Data>();

  return (
    <UserPreviewContext.Provider
      value={useMemo(() => ({ data, setData }), [data, setData])}
    >
      {children}
    </UserPreviewContext.Provider>
  );
};
