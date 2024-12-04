import { Appearance } from "react-native";
const isDartMode = Appearance.getColorScheme() == "dark";

export const backgroundColor = {
  fab: isDartMode ? "#FFFFFF" : "#000000",
  Ionicons: isDartMode ? "#000000" : "#FFFFFF",
  backgroundScreen: isDartMode ? "#000000" : "#FFFFFF",
  customButton: isDartMode ? "#FFFFFF" : "#000000",
  ButtonTextColor: isDartMode ? "#000000" : "#FFFFFF",
};
