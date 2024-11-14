import React from "react";
import { TextInput, StyleSheet, KeyboardTypeOptions } from "react-native";

interface ICustomInput {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: ICustomInput) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default CustomInput;
