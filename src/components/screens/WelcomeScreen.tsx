import * as React from "react";
import { StyleSheet, View } from "react-native";

import { createNavigatorFunction } from "../../util";
import { WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";
import WobblyText from "../atoms/WobblyText";
import { VerticalButtonGroup } from "../molecules";

class WelcomeScreen extends React.PureComponent {
  public static navigationOptions = {
    header: null
  };

  public render() {
    return (
      <View style={styles.welcome}>
        <WobblyText largeTitle={true} style={styles.welcomeHeading}>
          Wobbly
        </WobblyText>
        <VerticalButtonGroup>
          <WobblyButton text="Sign up" intent={Intent.PRIMARY} onPress={createNavigatorFunction("Signup")} />
          <WobblyButton text="Login" onPress={createNavigatorFunction("Login")} minimal={true} />
        </VerticalButtonGroup>
      </View>
    );
  }
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    padding: 20,
    justifyContent: "space-around"
  },
  welcomeHeading: {
    textAlign: "center",
    marginBottom: 10
  }
});
