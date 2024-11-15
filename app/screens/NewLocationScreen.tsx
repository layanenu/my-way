import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../navigation/types";
import { RouteProp } from "@react-navigation/native";

type NewLocationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "NewLocationScreen"
>;

type NewLocationScreenRouteProp = RouteProp<
  RootStackParamList,
  "NewLocationScreen"
>;

type Props = {
  navigation: NewLocationScreenNavigationProp;
  route: NewLocationScreenRouteProp;
};

export interface Location {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  markerColor: string;
}

export const NewLocationScreen = ({ navigation, route }: Props) => {
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [markerColor, setMarkerColor] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const location = route.params?.location;

  useEffect(() => {
    if (location) {
      setLocationName(location.name);
      setLatitude(location.latitude);
      setLongitude(location.longitude);
      setMarkerColor(location.markerColor);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [location]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditing ? "Editar Localização" : "Adicionar Localização",
    });
  }, [isEditing, navigation]);

  const handleSave = async () => {
    if (!locationName || !latitude || !longitude || !markerColor) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const newLocation = {
      id: isEditing ? location?.id : Date.now().toString(),
      name: locationName,
      latitude,
      longitude,
      markerColor,
    };

    try {
      const existingLocations = await AsyncStorage.getItem("locations");
      const locations = existingLocations ? JSON.parse(existingLocations) : [];

      if (isEditing) {
        const index = locations.findIndex(
          (loc: Location) => loc.id === location?.id
        );
        locations[index] = newLocation;
      } else {
        locations.push(newLocation);
      }

      await AsyncStorage.setItem("locations", JSON.stringify(locations));
      Alert.alert(
        "Sucesso",
        isEditing ? "Localização atualizada!" : "Localização salva!"
      );

      setLocationName("");
      setLatitude("");
      setLongitude("");
      setMarkerColor("");

      navigation.navigate("LocationListScreen");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar a localização. Tente novamente.");
      console.error("Erro ao salvar a localização:", error);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !location) return;

    try {
      const existingLocations = await AsyncStorage.getItem("locations");
      const locations = existingLocations ? JSON.parse(existingLocations) : [];

      const updatedLocations = locations.filter(
        (loc: Location) => loc.id !== location.id
      );

      await AsyncStorage.setItem("locations", JSON.stringify(updatedLocations));
      Alert.alert("Sucesso", "Localização removida!");

      navigation.navigate("LocationListScreen");
    } catch (error) {
      Alert.alert("Erro", "Falha ao remover a localização. Tente novamente.");
      console.error("Erro ao remover a localização:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.inputContainer}>
        <CustomInput
          placeholder="Nome da localização"
          value={locationName}
          onChangeText={setLocationName}
        />
        <CustomInput
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <CustomInput
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <CustomInput
          placeholder="Cor do marcador (ex: #FF0000)"
          value={markerColor}
          onChangeText={setMarkerColor}
        />
      </View>
      <CustomButton
        color="black"
        name={isEditing ? "Atualizar Localização" : "Salvar Localização"}
        onPress={handleSave}
      />
      {isEditing && (
        <CustomButton
          color="gray"
          name="Remover Localização"
          onPress={handleDelete}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginTop: 20,
  },
});
