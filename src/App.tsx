import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { Asset, Font, SecureStore } from "expo";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { NavigationContainerComponent } from "react-navigation";

import AppNavigation from "./AppNavigation";
import AppWithSubscriptions from "./AppWithSubscriptions";
import { SplashScreen } from "./components/screens";
import { OWN_INFO_QUERY, OwnInfoQuery } from "./graphql/queries";
import { NavigationService } from "./services";

interface IAppState {
  clientHasLoaded: boolean;
  fontsHaveLoaded: boolean;
  imagesHaveLoaded: boolean;
}
export default class App extends React.Component<{}, IAppState> {
  private client?: ApolloClient<any>;

  public constructor(props: {}) {
    super(props);
    this.state = { clientHasLoaded: false, fontsHaveLoaded: false, imagesHaveLoaded: false };
  }

  public async componentDidMount() {
    await this.initClient();
    await this.initFonts();
    await this.initImages();
  }

  public render() {
    if (!this.state.clientHasLoaded || !this.state.fontsHaveLoaded || !this.state.imagesHaveLoaded || !this.client) {
      return <SplashScreen />;
    }
    const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV" : null;

    return (
      <ApolloProvider client={this.client}>
        <OwnInfoQuery query={OWN_INFO_QUERY}>
          {ownInfoResult => (
            <AppWithSubscriptions ownInfoResult={ownInfoResult}>
              <ActionSheetProvider>
                <AppNavigation
                  ref={(el: NavigationContainerComponent | null) => {
                    NavigationService.setTopLevelNavigator(el);
                  }}
                  persistenceKey={navigationPersistenceKey}
                />
              </ActionSheetProvider>
            </AppWithSubscriptions>
          )}
        </OwnInfoQuery>
      </ApolloProvider>
    );
  }

  private async initClient() {
    const protocol = __DEV__ ? "http" : "https";
    // 10.0.3.2 is the IP of the host machine that Genymotion runs on
    // If running on a real device, set this to the local IP of your machine
    const serverHost = __DEV__ ? "192.168.1.169" : "staging.wobbly.app";
    const httpPort = __DEV__ ? "4000" : "443";
    const httpLink = createHttpLink({
      uri: `${protocol}://${serverHost}:${httpPort}`
    });

    const authToken = await SecureStore.getItemAsync("token");
    const wsLink = new WebSocketLink({
      uri: `ws://${serverHost}:${httpPort}/ws`,
      options: {
        reconnect: true,
        connectionParams: {
          Authorization: `Bearer ${authToken}`
        }
      }
    });
    const authLink = setContext(async (_, { headers }) => {
      // TODO: can we get this once in `initClient` so that it doesn't run on
      // every request?
      const token = await SecureStore.getItemAsync("token");
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ""
        }
      };
    });

    // Make subscriptions go over the WebSocket link
    const allLinks = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === "OperationDefinition" && definition.operation === "subscription";
      },
      wsLink,
      authLink.concat(httpLink)
    );

    this.client = new ApolloClient({
      link: allLinks,
      cache: new InMemoryCache({ addTypename: true })
    });
    this.setState({ clientHasLoaded: true });
  }

  private async initFonts() {
    await Font.loadAsync({
      "open-sans-regular": require("../assets/fonts/OpenSans-Regular.ttf"),
      "open-sans-bold": require("../assets/fonts/OpenSans-Bold.ttf"),
      "montserrat-regular": require("../assets/fonts/Montserrat-Regular.ttf"),
      "montserrat-bold": require("../assets/fonts/Montserrat-Bold.ttf"),
      "montserrat-black": require("../assets/fonts/Montserrat-Black.ttf")
    });
    this.setState({ fontsHaveLoaded: true });
  }

  private async initImages() {
    await Asset.loadAsync([
      require("../assets/images/pluto/pluto-welcome.png"),
      require("../assets/images/pluto/pluto-sign-up.png"),
      require("../assets/images/pluto/pluto-searching.png"),
      require("../assets/images/pluto/pluto-downloading.png"),
      require("../assets/images/pluto/pluto-sign-in.png"),
      require("../assets/images/pluto/list-is-empty-3.png"),
      require("../assets/images/pluto/pluto-uploading-1.png"),
      require("../assets/images/pluto/pluto-page-under-construction.png"),
      require("../assets/images/pluto/pluto-fatal-error.png")
    ]);
    this.setState({ imagesHaveLoaded: true });
  }
}
