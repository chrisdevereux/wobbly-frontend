import { inflect } from "inflection";
import * as React from "react";
import { FlatList } from "react-native";
import { ListItem } from "react-native-elements";

import { getGroups_groups } from "../../generated/getGroups";
import { searchGroups_searchGroups } from "../../generated/searchGroups";
import WobblyText from "../atoms/WobblyText";

interface IGroupsListProps {
  groups: getGroups_groups[] | searchGroups_searchGroups[];
  onPressFactory: (item: getGroups_groups | searchGroups_searchGroups) => () => void;
  refreshing?: boolean;
  onEndReached?: () => void;
}
class GroupsList extends React.PureComponent<IGroupsListProps> {
  public render() {
    const { groups, refreshing, onEndReached } = this.props;
    return (
      <FlatList
        data={groups as any} // TODO: fix this type hack
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
      />
    );
  }

  private keyExtractor = (group: getGroups_groups | searchGroups_searchGroups) => group.id!;

  private renderItem = ({ item }: { item: getGroups_groups | searchGroups_searchGroups }) => {
    const onPress = this.props.onPressFactory(item);
    const subtitle =
      item.__typename === "Group"
        ? `${item.memberCount} ${inflect("member", item.memberCount)}`
        : item.description || undefined;
    return (
      <ListItem
        title={<WobblyText>{item.name}</WobblyText>}
        subtitle={<WobblyText>{subtitle}</WobblyText>}
        onPress={onPress}
        leftAvatar={{ rounded: true, icon: { name: "home" } }}
        rightIcon={{ name: "chevron-right" }}
        subtitleProps={{ numberOfLines: 1, ellipsizeMode: "tail" }}
        bottomDivider={true}
      />
    );
  };
}

export default GroupsList;
