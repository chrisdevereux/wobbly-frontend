import * as React from "react";
import { StyleSheet } from "react-native";

import WobblyText from "./WobblyText";

interface IFormLabelProps {
  children: string;
}

const FormLabel = ({ children }: IFormLabelProps) => <WobblyText style={style.label}>{children}</WobblyText>;
export default FormLabel;

const style = StyleSheet.create({
  label: {
    marginLeft: 8,
    marginRight: 8
  }
});
