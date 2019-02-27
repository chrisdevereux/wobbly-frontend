import * as React from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../../style/common";

import WobblyText from "./WobblyText";

interface IFooterProps {
  text: string;
  button?: JSX.Element;
}
const Footer: React.SFC<IFooterProps> = ({ text, button }) => (
  <View style={style.container}>
    <WobblyText style={style.text}>{text}</WobblyText>
    {button}
  </View>
);
export default Footer;

const style = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: "20%",
    backgroundColor: colors.lightGray4,
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: colors.darkGray5,
    marginBottom: 5
  }
});
