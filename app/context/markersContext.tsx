import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { database } from "../config/firebaseConfig";

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
  addMarker: (marker: Marker) => Promise<void>;
  updateMarker: (marker: Marker) => Promise<void>;
  deleteMarker: (id: string) => Promise<void>;
};

const MarkersContext = createContext<MarkersContextType | undefined>(undefined);

export const MarkersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [markers, setMarkers] = useState<Marker[]>([]);

  const loadMarkers = async () => {
    try {
      const querySnapshot = await getDocs(collection(database, "markers"));
      const loadedMarkers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Marker[];
      setMarkers(loadedMarkers);
    } catch (error) {
      console.error("Erro ao carregar marcadores:", error);
    }
  };

  useEffect(() => {
    loadMarkers();
  }, []);

  const addMarker = async (marker: Marker) => {
    try {
      const docRef = await addDoc(collection(database, "markers"), marker);
      setMarkers((prev) => [...prev, { ...marker, id: docRef.id }]);
    } catch (error) {
      console.error("Erro ao adicionar marcador:", error);
    }
  };

  const updateMarker = async (marker: Marker) => {
    if (!marker.id) return;
    try {
      const markerDoc = doc(database, "markers", marker.id);
      await updateDoc(markerDoc, marker);
      setMarkers((prev) =>
        prev.map((m) => (m.id === marker.id ? { ...m, ...marker } : m))
      );
    } catch (error) {
      console.error("Erro ao atualizar marcador:", error);
    }
  };

  const deleteMarker = async (id: string) => {
    try {
      const markerDoc = doc(database, "markers", id);
      await deleteDoc(markerDoc);
      setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    } catch (error) {
      console.error("Erro ao deletar marcador:", error);
    }
  };

  return (
    <MarkersContext.Provider
      value={{ markers, addMarker, updateMarker, deleteMarker }}
    >
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
