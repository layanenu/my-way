import React, { createContext, useState, useContext, ReactNode } from "react";

type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

type UserLocationContextType = {
  location: UserLocation;
  setLocation: React.Dispatch<React.SetStateAction<UserLocation>>;
  errorMsg: string | null;
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
};

const UserLocationContext = createContext<UserLocationContextType | undefined>(
  undefined
);

export const UserLocationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<UserLocation>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <UserLocationContext.Provider
      value={{ location, setLocation, errorMsg, setErrorMsg }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => {
  const context = useContext(UserLocationContext);
  if (!context) {
    throw new Error(
      "useUserLocation must be used within a UserLocationProvider"
    );
  }
  return context;
};
