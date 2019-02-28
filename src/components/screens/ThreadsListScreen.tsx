import hoistNonReactStatics from "hoist-non-react-statics";
import { get, reverse, sortBy } from "lodash";
import * as React from "react";
import { NavigationInjectedProps } from "react-navigation";
import HeaderButtons from "react-navigation-header-buttons";

import { getThreads_threads } from "../../generated/getThreads";
import {
  GROUP_DETAILS_QUERY,
  GroupDetailsQuery,
  GroupDetailsQueryResult,
  THREADS_QUERY,
  ThreadsQuery,
  ThreadsQueryResult
} from "../../graphql/queries";
import { createNavigatorFunction } from "../../util";
import { WobblyHeaderButtons } from "../molecules";
import { ErrorState, LoadingState, ThreadsList } from "../organisms";

interface IThreadsListScreenProps extends NavigationInjectedProps {
  threadsResult: ThreadsQueryResult;
  groupDetailsResult: GroupDetailsQueryResult;
}
class ThreadsListScreen extends React.Component<IThreadsListScreenProps> {
  public static navigationOptions = ({ navigation }: NavigationInjectedProps) => {
    const groupId = navigation.getParam("groupId");
    const navigateToGroupDetails = createNavigatorFunction("GroupDetails", { groupId });
    const navigateToCreateThread = createNavigatorFunction("CreateThread", { groupId });

    const groupName = navigation.getParam("groupName"); // this gets set by `componentDidUpdate` below
    return {
      title: groupName || "Loading...",
      headerRight: (
        <WobblyHeaderButtons>
          <HeaderButtons.Item title="Add" iconName="create" onPress={navigateToCreateThread} />
          <HeaderButtons.Item title="Info" iconName="info" onPress={navigateToGroupDetails} />
        </WobblyHeaderButtons>
      )
    };
  };

  public componentDidMount() {
    this.setGroupName();
  }

  public componentDidUpdate() {
    this.setGroupName();
  }

  public render() {
    const { threadsResult, groupDetailsResult } = this.props;
    if (threadsResult.loading || groupDetailsResult.loading) {
      return <LoadingState />;
    } else if (threadsResult.error || groupDetailsResult.error) {
      return <ErrorState />;
    }
    const threads: getThreads_threads[] = get(threadsResult, "data.threads", []);
    let sortedThreads = sortBy(threads, thread => new Date(thread.posts[thread.posts.length - 1].createdAt));
    sortedThreads = reverse(sortBy(sortedThreads, ["pinned"])); // this is an in-place sort
    return (
      <ThreadsList
        threads={sortedThreads}
        onPressFactory={this.onPressFactory}
        groupId={this.props.navigation.getParam("groupId")}
      />
    );
  }

  private setGroupName = () => {
    // We could just pass this as a navigation param from the groups list screen, but then it wouldn't update
    // when editing the group name.
    // However, if we *don't* set it as a navigation param, then there's an awkward period while the query loads
    // where the screen doesn't have a title. To get over this we do both -- set the title as a navigation param
    // AND update it from the cache.
    const { groupDetailsResult, navigation } = this.props;
    if (!groupDetailsResult.data || !groupDetailsResult.data.group) {
      return;
    }
    const prevName = navigation.getParam("groupName");
    const newName = groupDetailsResult.data.group.name;
    if (prevName !== newName) {
      navigation.setParams({ groupName: groupDetailsResult.data.group.name });
    }
  };

  private onPressFactory = (item: getThreads_threads): (() => void) => {
    const groupId = this.props.navigation.getParam("groupId", "");
    return createNavigatorFunction("Thread", { threadId: item.id, threadTitle: item.title, groupId });
  };
}

const EnhancedComponent = ({ navigation }: NavigationInjectedProps) => (
  <GroupDetailsQuery query={GROUP_DETAILS_QUERY} variables={{ groupId: navigation.getParam("groupId") }}>
    {groupDetailsResult => (
      <ThreadsQuery query={THREADS_QUERY} variables={{ groupId: navigation.getParam("groupId") }}>
        {threadsResult => (
          <ThreadsListScreen
            threadsResult={threadsResult}
            groupDetailsResult={groupDetailsResult}
            navigation={navigation}
          />
        )}
      </ThreadsQuery>
    )}
  </GroupDetailsQuery>
);

export default hoistNonReactStatics(EnhancedComponent, ThreadsListScreen);
