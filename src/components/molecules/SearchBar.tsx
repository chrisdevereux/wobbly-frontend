import { MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { colors } from "../../style/common";

interface ISearchBarProps {
  placeholder?: string;
  onSubmit: (text: string) => void;
}
interface ISearchBarState {
  text?: string;
}

class SearchBar extends React.PureComponent<ISearchBarProps, ISearchBarState> {
  public render() {
    const { placeholder } = this.props;
    return (
      <View style={styles.searchBar}>
        <MaterialIcons style={styles.searchIcon} name="search" size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder || "Search..."}
          placeholderTextColor={colors.darkGray5}
          clearButtonMode="while-editing"
          enablesReturnKeyAutomatically={true}
          returnKeyType="search"
          onSubmitEditing={this.onSubmit}
          onChangeText={this.onChangeText}
        />
      </View>
    );
  }

  private onChangeText = (text: string) => {
    this.setState({ text });
  };

  private onSubmit = () => {
    const { text } = this.state;
    if (!text) {
      return;
    }
    this.props.onSubmit(text);
  };
}
export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    backgroundColor: colors.lightGray4,
    borderRadius: 10,
    margin: 10
  },
  searchIcon: {
    padding: 10,
    paddingLeft: 20,
    color: colors.darkGray5
  },
  searchInput: {
    padding: 5,
    flex: 1
  }
});
