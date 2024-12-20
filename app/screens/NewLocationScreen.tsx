import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { RootStackParamList } from "../navigation/types";
import { RouteProp } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { backgroundColor } from "../styles/global.styles";
import { isHexColor, isRealNumber } from "../utils/validations";
import { useMarkers } from "../context/markersContext";

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
  const { markers, setMarkers } = useMarkers();
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [markerColor, setMarkerColor] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [orientation, setOrientation] = useState("portrait");
  const location = route.params?.location;

  useEffect(() => {
    const detectOrientation = async () => {
      const currentOrientation = await ScreenOrientation.getOrientationAsync();
      if (
        currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        currentOrientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setOrientation("landscape");
      } else {
        setOrientation("portrait");
      }
    };

    const subscription = ScreenOrientation.addOrientationChangeListener(() => {
      detectOrientation();
    });

    detectOrientation();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

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

    if (!isRealNumber(latitude) || !isRealNumber(longitude)) {
      Alert.alert("Erro", "Esse campo somente aceita valores numericos");
      return;
    }

    if (!isHexColor(markerColor)) {
      Alert.alert(
        "Erro",
        "Esse campo somente aceita cores em formato de hexadecimais"
      );
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
      if (isEditing) {
        const updatedMarkers = markers.map((marker) =>
          marker.id === location?.id ? newLocation : marker
        );
        setMarkers(updatedMarkers);
      } else {
        setMarkers((prevMarkers) => [...prevMarkers, newLocation]);
      }

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
      const updatedMarkers = markers.filter(
        (marker) => marker.id !== location.id
      );
      setMarkers(updatedMarkers);

      Alert.alert("Sucesso", "Localização removida!");

      navigation.navigate("LocationListScreen");
    } catch (error) {
      Alert.alert("Erro", "Falha ao remover a localização. Tente novamente.");
      console.error("Erro ao remover a localização:", error);
    }
  };

  const handleNavigateToMap = () => {
    if (latitude && longitude) {
      navigation.navigate("HomeScreen", {
        mapRegion: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
      });
    } else {
      Alert.alert("Erro", "Coordenadas inválidas.");
    }
  };
  const dynamicStyles = styles(orientation, isEditing);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={dynamicStyles.container}
      bounces={false}
    >
      <View style={dynamicStyles.inputContainer}>
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
      <View style={dynamicStyles.btnContainer}>
        <CustomButton
          color="info"
          ButtonTextColor={backgroundColor.ButtonTextColor}
          name={isEditing ? "Atualizar Localização" : "Salvar Localização"}
          onPress={handleSave}
        />
        {isEditing && (
          <>
            <CustomButton
              color="danger"
              name="Remover Localização"
              onPress={handleDelete}
            />
            <CustomButton
              color="warning"
              name="Ir até a localização no mapa"
              onPress={handleNavigateToMap}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = (orientation: string, isEditing: boolean) => {
  const isLandscape = orientation === "landscape";

  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: backgroundColor.backgroundScreen,
      paddingHorizontal: 16,
      paddingBottom: 24,
      alignItems: "center",
    },
    inputContainer: {
      marginTop: 20,
      padding: isLandscape ? 8 : 0,
      borderRadius: 8,
      width: isLandscape ? "90%" : "100%",
    },
    btnContainer: {
      paddingHorizontal: isLandscape && isEditing ? 8 : 0,
      width: isEditing ? (isLandscape ? "90%" : "100%") : "70%",
      flexDirection: isEditing && isLandscape ? "row" : "column",
      justifyContent: isEditing ? "space-between" : "center",
    },
  });
};
