import * as React from "react";
import { FlatList } from "react-native";
import { ListItem } from "react-native-elements";

import { getGroupDetails_group_members } from "../../generated/getGroupDetails";
import WobblyText from "../atoms/WobblyText";

interface IPersonListProps {
  people: getGroupDetails_group_members[];
}
const PersonList: React.FC<IPersonListProps> = ({ people }) => (
  <FlatList keyExtractor={keyExtractor} data={people} renderItem={renderItem} />
);

const keyExtractor = (item: getGroupDetails_group_members) => item.id;
const renderItem = ({ item }: { item: getGroupDetails_group_members; index: number }) => {
  return (
    <ListItem
      title={<WobblyText>{item.name}</WobblyText>}
      topDivider={true}
      bottomDivider={true}
      leftAvatar={{ rounded: true, icon: { name: "person" } }}
    />
  );
};

export default PersonList;
