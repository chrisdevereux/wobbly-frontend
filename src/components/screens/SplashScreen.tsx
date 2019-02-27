import { SecureStore } from "expo";
import * as React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationInjectedProps } from "react-navigation";

import { colors } from "../../style/common";

type ISplashScreenProps = Partial<NavigationInjectedProps>;

/**
 * react-navigation opens this as the default screen but immediately redirects to the Auth or App stack,
 * depending on whether the user is authenticated or not.
 */
class SplashScreen extends React.PureComponent<ISplashScreenProps> {
  public constructor(props: ISplashScreenProps) {
    super(props);
    this.bootstrap();
  }

  public render() {
    return <SafeAreaView style={style.wrapper} />;
  }

  private bootstrap = async () => {
    const { navigation } = this.props;
    if (!navigation) {
      return;
    }
    const token = await SecureStore.getItemAsync("token");
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // https://reactnavigation.org/docs/en/auth-flow.html
    navigation.navigate(token ? "App" : "Auth");
  };
}

export default SplashScreen;

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.red1
  }
});
