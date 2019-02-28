import { SecureStore } from "expo";
import * as React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { ScrollView } from "react-native";
import HeaderButtons from "react-navigation-header-buttons";

import { NavigationService } from "../../services";
import { createNavigatorFunction } from "../../util";
import { WobblyButton } from "../atoms";
import { WobblyHeaderButtons } from "../molecules";
import { UpdatePersonForm } from "../organisms";

interface IAccountScreenProps extends WithApolloClient<{}> {
  displayName: string;
  email: string;
}

class AccountScreen extends React.Component<IAccountScreenProps> {
  public static navigationOptions = () => {
    const navigateToSettings = createNavigatorFunction("Settings");
    return {
      title: "Account",
      headerRight: (
        <WobblyHeaderButtons>
          <HeaderButtons.Item title="Settings" iconName="settings" onPress={navigateToSettings} />
        </WobblyHeaderButtons>
      )
    };
  };

  public render() {
    return (
      <ScrollView>
        <UpdatePersonForm />
        <WobblyButton onPress={this.logout}>{"Log out"}</WobblyButton>
      </ScrollView>
    );
  }

  private logout = () => {
    // These are both promises but we kick them both off at once
    this.props.client.resetStore();
    SecureStore.deleteItemAsync("token");
    // Navigate to login screen
    NavigationService.navigate("Auth");
  };
}

export default withApollo(AccountScreen);
