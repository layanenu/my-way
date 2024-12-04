import React from "react";
import styled from "styled-components/native";

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
  ButtonTextColor,
}: ICustomButtonProps) => {
  return (
    <ButtonContainer color={color} onPress={onPress}>
      <ButtonText ButtonTextColor={ButtonTextColor ?? "#FFFFFF"}>
        {name}
      </ButtonText>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.TouchableOpacity<{ color: string }>`
  padding-vertical: 12px;
  padding-horizontal: 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-vertical: 8px;
  background-color: ${(props) => props.color};
`;

const ButtonText = styled.Text<{ ButtonTextColor: string }>`
  color: ${(props) => props.ButtonTextColor};
  font-size: 16px;
  font-weight: bold;
`;

export default CustomButton;
