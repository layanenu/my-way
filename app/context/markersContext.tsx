import React, { createContext, useState, useContext, ReactNode } from "react";

export type Marker = {
  id?: string;
  name: string;
  latitude: string;
  longitude: string;
  markerColor: string;
  country?: string;
  currency?: string;
};

type MarkersContextType = {
  markers: Marker[];
  setMarkers: React.Dispatch<React.SetStateAction<Marker[]>>;
};

const MarkersContext = createContext<MarkersContextType | undefined>(undefined);

export const MarkersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [markers, setMarkers] = useState<Marker[]>([]);

  return (
    <MarkersContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MarkersContext.Provider>
  );
};

export const useMarkers = () => {
  const context = useContext(MarkersContext);
  if (!context) {
    throw new Error("useMarkers must be used within a MarkersProvider");
  }
  return context;
};
