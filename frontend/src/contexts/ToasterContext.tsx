import { createContext } from 'react';

type ToasterContextType = {
  toasterId: string;
};

export const ToasterContext = createContext<ToasterContextType>(
  {} as ToasterContextType,
);
