import * as React from "react";
import { StyleSheet, Text } from "react-native";

import { standardColors } from "../../style/common";

interface IFormLabelProps {
  children: string;
}

const FormLabel = ({ children }: IFormLabelProps) => <Text style={style.label}>{children}</Text>;
export default FormLabel;

const style = StyleSheet.create({
  label: {
    color: standardColors.primaryText,
    marginLeft: 8,
    marginRight: 8
  }
});
