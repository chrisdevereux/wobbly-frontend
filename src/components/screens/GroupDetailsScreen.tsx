import hoistNonReactStatics from "hoist-non-react-statics";
import { inflect } from "inflection";
import { remove } from "lodash";
import * as React from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { Image, ListItem } from "react-native-elements";
import { NavigationInjectedProps } from "react-navigation";

import { getGroups, getGroups_groups } from "../../generated/getGroups";
import {
  LEAVE_GROUP_MUTATION,
  LeaveGroupMutation,
  LeaveGroupMutationFn,
  LeaveGroupMutationResult,
  LeaveGroupMutationUpdaterFn,
  UPDATE_GROUP_MUTATION,
  UpdateGroupMutation,
  UpdateGroupMutationFn,
  UpdateGroupMutationResult
} from "../../graphql/mutations";
import { GROUP_DETAILS_QUERY, GroupDetailsQuery, GroupDetailsQueryResult, GROUPS_QUERY } from "../../graphql/queries";
import { NavigationService } from "../../services";
import { colors } from "../../style/common";
import { ListSection } from "../atoms";
import WobblyText from "../atoms/WobblyText";
import { LoadingState, PersonList } from "../organisms";

interface IGroupDetailsScreen extends NavigationInjectedProps {
  // Group details query
  groupDetails: GroupDetailsQueryResult;
  // Leave group mutation
  leaveGroup: LeaveGroupMutationFn;
  leaveGroupResult: LeaveGroupMutationResult;
  // Update group mutation
  updateGroup: UpdateGroupMutationFn;
  updateGroupResult: UpdateGroupMutationResult;
}
class GroupDetailsScreen extends React.PureComponent<IGroupDetailsScreen> {
  public static navigationOptions = () => {
    return {
      title: "Group details"
    };
  };
  private groupId: string;
  private groupName: string;

  public constructor(props: IGroupDetailsScreen) {
    super(props);
    this.groupId = props.navigation.getParam("groupId", "");
    this.groupName = props.navigation.getParam("groupName", "");
  }

  public render() {
    if (this.props.groupDetails.loading) {
      return <LoadingState />;
    } else {
      const group = this.props.groupDetails.data!.group!;
      const members = group.members || [];
      return (
        <ScrollView style={style.container}>
          <Image source={{ uri: "https://placeimg.com/600/200/nature" }} resizeMode="cover" style={style.groupImage} />
          <ListSection>
            <ListItem title={<WobblyText headline={true}>{this.groupName}</WobblyText>} bottomDivider={true} />
            <ListItem title={group.description || "Add a description"} bottomDivider={true} />
          </ListSection>
          <ListSection>
            <WobblyText listHeading={true}>
              {`${members.length} ${inflect("member", members.length)}`.toUpperCase()}
            </WobblyText>
            <PersonList people={members} />
          </ListSection>
          <ListSection>
            <ListItem
              title="Leave group"
              leftIcon={{ name: "md-exit", type: "ionicon" }}
              onPress={this.handleLeaveGroup}
            />
          </ListSection>
        </ScrollView>
      );
    }
  }

  private handleLeaveGroup = () => {
    const leaveGroup = () =>
      this.props.leaveGroup({ variables: { groupId: this.groupId } }).then(() => {
        NavigationService.navigate("GroupsList");
      });
    Alert.alert("Confirm", "Are you sure you want to leave the group?", [
      { text: "Cancel" },
      { text: "Yes", onPress: leaveGroup }
    ]);
  };
}

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray4,
    height: "100%"
  },
  groupImage: {
    height: 200,
    width: "100%"
  }
});

const leaveGroupUpdateCache: LeaveGroupMutationUpdaterFn = (cache, { data }) => {
  const prevData = cache.readQuery<getGroups>({ query: GROUPS_QUERY });
  const groups = (prevData && prevData.groups) || [];
  const leftGroupId = data!.leaveGroup.id;
  remove(groups, (group: getGroups_groups) => group.id === leftGroupId);
  cache.writeQuery({
    query: GROUPS_QUERY,
    data: {
      groups
    }
  });
};
const EnhancedComponent = ({ navigation }: NavigationInjectedProps) => (
  <GroupDetailsQuery query={GROUP_DETAILS_QUERY} variables={{ groupId: navigation.getParam("groupId") }}>
    {groupDetails => (
      <UpdateGroupMutation mutation={UPDATE_GROUP_MUTATION} variables={{ groupId: navigation.getParam("groupId") }}>
        {(updateGroup, updateGroupResult) => (
          <LeaveGroupMutation mutation={LEAVE_GROUP_MUTATION} update={leaveGroupUpdateCache}>
            {(leaveGroup, leaveGroupResult) => (
              <GroupDetailsScreen
                groupDetails={groupDetails}
                leaveGroup={leaveGroup}
                leaveGroupResult={leaveGroupResult}
                updateGroup={updateGroup}
                updateGroupResult={updateGroupResult}
                navigation={navigation}
              />
            )}
          </LeaveGroupMutation>
        )}
      </UpdateGroupMutation>
    )}
  </GroupDetailsQuery>
);
export default hoistNonReactStatics(EnhancedComponent, GroupDetailsScreen);
