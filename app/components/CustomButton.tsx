import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ICustomButtonProps {
  color: string;
  name: string;
  onPress: () => void;
}

const CustomButton = ({ color, name, onPress }: ICustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
