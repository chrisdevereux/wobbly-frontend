import { SecureStore } from "expo";
import * as React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { Image, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderButtons from "react-navigation-header-buttons";

import { NavigationService } from "../../services";
import { createNavigatorFunction } from "../../util";
import { WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";
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
      <KeyboardAwareScrollView>
        <Image source={require("../../../assets/images/pluto/pluto-page-under-construction.png")} style={style.image} />
        <UpdatePersonForm />
        <WobblyButton text="Log out" onPress={this.logout} intent={Intent.DANGER} />
      </KeyboardAwareScrollView>
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

const style = StyleSheet.create({
  image: {
    flex: 0,
    width: "100%",
    height: 250,
    resizeMode: "contain"
  }
});

export default withApollo(AccountScreen);
