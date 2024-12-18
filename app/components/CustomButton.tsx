import React from "react";
import { Button } from "native-base";

interface ICustomButtonProps {
  color: string;
  name: string;
  onPress: () => void;
  ButtonTextColor?: string;
}

const CustomButton = ({
  color,
  name,
  onPress,
  ButtonTextColor = "#FFFFFF",
}: ICustomButtonProps) => {
  return (
    <Button
      onPress={onPress}
      colorScheme={color}
      _text={{ color: ButtonTextColor, fontSize: "16px", fontWeight: "bold" }}
      borderRadius="8"
      paddingY="12px"
      paddingX="20px"
      marginY="8px"
    >
      {name}
    </Button>
  );
};

export default CustomButton;
