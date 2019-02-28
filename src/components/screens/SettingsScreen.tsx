import * as React from "react";
import { ScrollView } from "react-native";
import HeaderButtons from "react-navigation-header-buttons";

import { createNavigatorFunction } from "../../util";
import { WobblyHeaderButtons } from "../molecules";
import { UpdateSettingsForm
 } from "../organisms";

class SettingsScreen extends React.Component {
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
        <UpdateSettingsForm
         />
      </ScrollView>
    );
  }
}

export default SettingsScreen;
