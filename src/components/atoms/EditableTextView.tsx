import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { colors } from "../../style/common";

import WobblyText from "./WobblyText";

interface IEditableTextViewProps {
  onPress: () => void;
  children: React.ReactElement | React.ReactElement[];
}
const EditableTextView: React.FC<IEditableTextViewProps> = ({ onPress, children }) => (
  <TouchableOpacity style={style.textBox} onPress={onPress}>
    <View style={style.text}>{children}</View>
    <WobblyText style={style.editText}>Edit</WobblyText>
  </TouchableOpacity>
);

const style = StyleSheet.create({
  textBox: {
    marginBottom: 10,
    backgroundColor: colors.lightGray5,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row"
  },
  text: {
    flex: 1
  },
  editText: {
    flex: 0,
    color: colors.gray2,
    textAlign: "right"
  }
});

export default EditableTextView;
