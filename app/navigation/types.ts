import { Location } from "../screens/NewLocationScreen";

export type RootStackParamList = {
  HomeScreen?: {
    mapRegion?: {
      latitude: number;
      longitude: number;
      latitudeDelta: number;
      longitudeDelta: number;
    };
  };
  LocationListScreen: undefined;
  NewLocationScreen?: { location?: Location };
};
