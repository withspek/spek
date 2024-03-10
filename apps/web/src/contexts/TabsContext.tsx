import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type TabsContextProps = {
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
};

type TabsProviderProps = {
  children: ReactNode;
};

const initialContext: TabsContextProps = {
  currentIndex: 0,
  setCurrentIndex: () => {},
};

const TabsContext = createContext<TabsContextProps>(initialContext);

export default function TabsProvider({ children }: TabsProviderProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <TabsContext.Provider value={{ currentIndex, setCurrentIndex }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabsContext(): TabsContextProps {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error("useTabs must be used with a TabsProvider");
  }

  return context;
}
