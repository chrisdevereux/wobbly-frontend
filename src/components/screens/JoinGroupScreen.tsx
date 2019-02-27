import hoistNonReactStatics from "hoist-non-react-statics";
import { get } from "lodash";
import * as React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationInjectedProps } from "react-navigation";

import { getGroups } from "../../generated/getGroups";
import {
  JOIN_GROUP_MUTATION,
  JoinGroupMutation,
  JoinGroupMutationFn,
  JoinGroupMutationResult,
  JoinGroupMutationUpdaterFn
} from "../../graphql/mutations";
import {
  GetPublicGroupDetailsQuery,
  GetPublicGroupDetailsQueryResult,
  GROUPS_QUERY,
  PUBLIC_GROUP_DETAILS_QUERY
} from "../../graphql/queries";
import { NavigationService } from "../../services";
import { WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";
import WobblyText from "../atoms/WobblyText";
import { ErrorState } from "../organisms";

interface IJoinGroupScreenProps extends NavigationInjectedProps {
  joinGroup: JoinGroupMutationFn;
  mutationResult: JoinGroupMutationResult;
  queryResult: GetPublicGroupDetailsQueryResult;
}
class JoinGroupScreen extends React.PureComponent<IJoinGroupScreenProps> {
  public static navigationOptions = ({ navigation }: NavigationInjectedProps) => {
    return {
      title: navigation.getParam("groupName", "Unknown group")
    };
  };

  private groupId: string;
  private groupName: string;

  public constructor(props: IJoinGroupScreenProps) {
    super(props);
    this.groupId = props.navigation.getParam("groupId", "");
    this.groupName = props.navigation.getParam("groupName", "");
  }

  public render() {
    const { mutationResult, queryResult } = this.props;
    if (queryResult.loading) {
      return <ActivityIndicator />;
    } else if (queryResult.error) {
      return <ErrorState subtitle={queryResult.error.message} />;
    }

    const description = get(queryResult, "data.group.description", undefined);
    const descriptionContainer = description ? (
      <View style={style.descriptionContainer}>
        <WobblyText>{description}</WobblyText>
      </View>
    ) : (
      undefined
    );

    return (
      <View style={style.container}>
        {descriptionContainer}
        <WobblyButton
          text="Join this group"
          isLoading={mutationResult.loading}
          intent={Intent.PRIMARY}
          disabled={mutationResult.loading}
          onPress={this.handleJoinGroup}
        />
      </View>
    );
  }

  private handleJoinGroup = () => {
    this.props.joinGroup({ variables: { groupId: this.groupId } }).then(() => {
      NavigationService.navigate("ThreadsList", { groupName: this.groupName, groupId: this.groupId });
    });
  };
}

const updateCache: JoinGroupMutationUpdaterFn = (cache, { data }) => {
  const prevData = cache.readQuery<getGroups>({ query: GROUPS_QUERY });
  cache.writeQuery({
    query: GROUPS_QUERY,
    data: {
      groups: (prevData!.groups || []).concat(data!.joinGroup)
    }
  });
};
const EnhancedComponent = ({ navigation }: NavigationInjectedProps) => (
  <GetPublicGroupDetailsQuery
    query={PUBLIC_GROUP_DETAILS_QUERY}
    variables={{ groupId: navigation.getParam("groupId") }}
  >
    {groupDetailsResult => (
      <JoinGroupMutation mutation={JOIN_GROUP_MUTATION} update={updateCache}>
        {(joinGroup, mutationResult) => (
          <JoinGroupScreen
            joinGroup={joinGroup}
            mutationResult={mutationResult}
            queryResult={groupDetailsResult}
            navigation={navigation}
          />
        )}
      </JoinGroupMutation>
    )}
  </GetPublicGroupDetailsQuery>
);
export default hoistNonReactStatics(EnhancedComponent, JoinGroupScreen);

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  descriptionContainer: {
    marginHorizontal: 10,
    marginVertical: 15
  }
});
