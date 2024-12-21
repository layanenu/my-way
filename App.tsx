import AppNavigator from "./app/navigation/AppNavigator";
import { NativeBaseProvider } from "native-base";
import { AppContextProvider } from "./app/context/appContextProvider";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useLazyQuery,
} from "@apollo/client";

export default function App() {
  const client = new ApolloClient({
    uri: "https://countries.trevorblades.com/",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <AppContextProvider>
          <AppNavigator />
        </AppContextProvider>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
