import { type ReactNode, createContext, useContext, useState } from "react";
import "./Tabs.css";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
}

export function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div className="tabs__list">{children}</div>;
};

Tabs.Trigger = function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs.Trigger must be used within Tabs");

  const isActive = context.activeTab === value;

  return (
    <button
      className={`tabs__trigger ${isActive ? "tabs__trigger--active" : ""}`}
      onClick={() => context.setActiveTab(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs.Panel must be used within Tabs");

  if (context.activeTab !== value) return null;

  return <div className="tabs__panel">{children}</div>;
};
