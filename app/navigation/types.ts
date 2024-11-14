import { Location } from "../screens/NewLocation";

export type RootStackParamList = {
  Home: undefined;
  NewLocation?: { location?: Location };
  LocationList: undefined;
};
