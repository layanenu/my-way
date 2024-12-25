import React from "react";
import { Box, HStack, Text, Image, VStack, Card } from "native-base";
import CustomButton from "./CustomButton";

export interface ILocationItem {
  title: string;
  latitude: string | number;
  longitude: string | number;
  onDelete: () => void;
}

const randomImages = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
];

const LocationItem = ({
  title,
  latitude,
  longitude,
  onDelete,
}: ILocationItem) => {
  const randomImage =
    randomImages[Math.floor(Math.random() * randomImages.length)];

  return (
    <Box bg="white" borderRadius="8" padding="12px" margin="8px" shadow="2">
      <HStack
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
      >
        <HStack alignItems="center" space={3} flexDirection="row">
          <Card shadow={8} padding="0" size="50px">
            <Image
              source={{ uri: randomImage }}
              alt="Turistic image"
              size="50px"
            />
          </Card>
          <Box>
            <Text fontSize="16px" fontWeight="bold" paddingBottom="2">
              {title}
            </Text>
            <Text fontSize="14px" color="coolGray.500">
              Latitude: {latitude}, Longitude: {longitude}
            </Text>
            <CustomButton
              onPress={() => onDelete()}
              color="danger"
              size="sm"
              name="Delete"
            />
          </Box>
        </HStack>
        <VStack alignItems="center"></VStack>
      </HStack>
    </Box>
  );
};

export default LocationItem;
