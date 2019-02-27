import hoistNonReactStatics from "hoist-non-react-statics";
import * as React from "react";
import HeaderButtons from "react-navigation-header-buttons";

import { GROUPS_QUERY, GroupsQuery, GroupsQueryResult } from "../../graphql/queries";
import { createNavigatorFunction } from "../../util";
import { NonIdealState, WobblyHeaderButtons } from "../molecules";
import { ErrorState, GroupsList, LoadingState } from "../organisms";

interface IGroupsListScreenProps {
  result: GroupsQueryResult;
}

class GroupsListScreen extends React.PureComponent<IGroupsListScreenProps> {
  public static navigationOptions = () => {
    const navigateToSearchGroups = createNavigatorFunction("SearchGroups");
    return {
      title: "Groups",
      headerRight: (
        <WobblyHeaderButtons>
          <HeaderButtons.Item title="Add" iconName="search" onPress={navigateToSearchGroups} />
        </WobblyHeaderButtons>
      )
    };
  };

  public render() {
    const { result } = this.props;
    if (result.loading) {
      return <LoadingState />;
    } else if (result.error) {
      return <ErrorState title="An error occurred" subtitle={result.error.message} />;
    }

    const groups = result.data && result.data.groups;
    if (groups && groups.length > 0) {
      return <GroupsList groups={groups} onPressFactory={this.onPressFactory} />;
    }

    return (
      <NonIdealState
        title="No groups"
        subtitle="Tap the search button above to find or create a new one!"
        imageRequire={require("../../../assets/images/pluto/list-is-empty-3.png")}
      />
    );
  }

  private onPressFactory = (item: any): (() => void) => {
    return createNavigatorFunction("ThreadsList", { groupId: item.id, groupName: item.name });
  };
}

const EnhancedComponent = () => (
  <GroupsQuery query={GROUPS_QUERY}>{result => <GroupsListScreen result={result} />}</GroupsQuery>
);
export default hoistNonReactStatics(EnhancedComponent, GroupsListScreen);
