import React from "react";
import { MarkersProvider } from "./markersContext";
import { UserLocationProvider } from "./userLocationContext";

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <MarkersProvider>
    <UserLocationProvider>{children}</UserLocationProvider>
  </MarkersProvider>
);
