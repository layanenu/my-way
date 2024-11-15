import { Location } from "../screens/NewLocationScreen";

export type RootStackParamList = {
  HomeScreen: undefined;
  LocationListScreen: undefined;
  NewLocationScreen?: { location?: Location };
};
