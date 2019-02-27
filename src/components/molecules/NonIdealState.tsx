import * as React from "react";
import { Image, StyleSheet, View } from "react-native";

import { colors } from "../../style/common";
import WobblyText from "../atoms/WobblyText";

interface INonIdealStateProps {
  IconFamily?: React.ComponentType<any>;
  iconName?: string;
  imageRequire?: NodeRequire;
  title: string;
  subtitle?: string;
}
const NonIdealState: React.SFC<INonIdealStateProps> = ({ IconFamily, iconName, imageRequire, title, subtitle }) => (
  <View style={style.container}>
    {IconFamily && iconName && <IconFamily name={iconName} size={50} color={colors.gray1} />}
    {imageRequire && <Image source={imageRequire} style={style.image} />}
    <WobblyText title2={true} style={style.title}>
      {title}
    </WobblyText>
    {subtitle && <WobblyText style={style.subtitle}>{subtitle}</WobblyText>}
  </View>
);
export default NonIdealState;

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    marginVertical: 5,
    color: colors.gray1
  },
  image: {
    flex: 0,
    width: "100%",
    height: 250,
    resizeMode: "contain"
  },
  subtitle: {
    color: colors.gray1,
    textAlign: "center",
    marginHorizontal: 15
  }
});
