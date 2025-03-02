import { createContext, useContext, useState } from "react";

const Context = createContext();

export function DemoProvider({ children }) {
  const [estado, setEstado] = useState("ON");
  return (
    <Context.Provider value={[estado, setEstado]}>
        {children}
    </Context.Provider>
  );
}

export function useDemoContext() {
  return useContext(Context);
}