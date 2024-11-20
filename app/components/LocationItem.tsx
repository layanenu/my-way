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
      <View style={styles.content}>
        <Ionicons name={iconName} size={24} />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>
            Latitude: {latitude}, Longitude: {longitude}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  content: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});

export default LocationItem;
