import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ILocationItem {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  latitude: string;
  longitude: string;
}

const LocationItem = ({
  iconName,
  title,
  latitude,
  longitude,
}: ILocationItem) => {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={24} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>
          Latitude: {latitude}, Longitude: {longitude}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});

export default LocationItem;
