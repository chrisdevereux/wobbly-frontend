import * as React from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";

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
      <SafeAreaView style={styles.welcome}>
        <WobblyText largeTitle={true} style={styles.welcomeHeading}>
          Wobbly
        </WobblyText>
        <Image source={require("../../../assets/images/pluto/pluto-welcome.png")} style={styles.image} />
        <VerticalButtonGroup>
          <WobblyButton text="Sign up" intent={Intent.PRIMARY} onPress={createNavigatorFunction("Signup")} />
          <WobblyButton text="Login" onPress={createNavigatorFunction("Login")} minimal={true} />
        </VerticalButtonGroup>
      </SafeAreaView>
    );
  }
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    padding: 20,
    justifyContent: "space-evenly"
  },
  welcomeHeading: {
    textAlign: "center",
    marginBottom: 10
  },
  image: {
    flex: 0,
    width: "100%",
    height: 300,
    resizeMode: "contain"
  }
});
