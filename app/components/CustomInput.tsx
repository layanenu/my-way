import React from "react";
import { Input } from "native-base";
import { KeyboardTypeOptions } from "react-native/Libraries/Components/TextInput/TextInput";

interface ICustomInput {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  disabled?: boolean;
}

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  disabled = false,
}: ICustomInput) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      borderWidth="1"
      borderColor="#ccc"
      borderRadius="8"
      padding="12px"
      fontSize="16px"
      marginBottom="16px"
      backgroundColor="#FFFFFF"
      placeholderTextColor="#808080"
      isDisabled={disabled}
    />
  );
};

export default CustomInput;
