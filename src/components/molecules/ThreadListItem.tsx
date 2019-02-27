import { ActionSheetProps, connectActionSheet } from "@expo/react-native-action-sheet";
import * as React from "react";
import { ActivityIndicator } from "react-native";
import { ListItem } from "react-native-elements";

import { getThreads, getThreads_threads } from "../../generated/getThreads";
import {
  TOGGLE_THREAD_PINNING_MUTATION,
  ToggleThreadPinningMutation,
  ToggleThreadPinningMutationFn,
  ToggleThreadPinningMutationResult,
  ToggleThreadPinningMutationUpdaterFn
} from "../../graphql/mutations";
import { THREADS_QUERY } from "../../graphql/queries";
import { colors } from "../../style/common";
import WobblyText from "../atoms/WobblyText";

/**
 * The props that consumers of this component need to pass
 */
interface IPublicProps {
  thread: getThreads_threads;
  groupId: string;
  onPress: () => void;
}
interface IThreadListItemProps extends IPublicProps, ActionSheetProps {
  toggleThreadPinning: ToggleThreadPinningMutationFn;
  mutationResult: ToggleThreadPinningMutationResult;
}
interface IThreadListItemState {
  isTogglingPinning: boolean;
}
// @ts-ignore since @expo/react-native-action-sheet types aren't easy
@connectActionSheet
class ThreadListItem extends React.PureComponent<IThreadListItemProps, IThreadListItemState> {
  public constructor(props: IThreadListItemProps) {
    super(props);
    this.state = { isTogglingPinning: false };
  }

  public componentDidUpdate() {
    if (this.props.mutationResult.data) {
      this.setState({ isTogglingPinning: false });
    }
  }

  public render() {
    const { thread, onPress } = this.props;
    const mostRecentPost = thread.posts[0].content;
    const mostRecentAuthor = thread.posts[0].author.name;
    const leftIcon = this.state.isTogglingPinning ? (
      <ActivityIndicator />
    ) : thread.pinned ? (
      { name: "pin", type: "octicon", color: colors.gray3 }
    ) : (
      undefined
    );
    return (
      <ListItem
        leftIcon={leftIcon}
        title={<WobblyText headline={true}>{thread.title}</WobblyText>}
        subtitle={<WobblyText subhead={true}>{`${mostRecentAuthor}: ${mostRecentPost}`}</WobblyText>}
        onPress={onPress}
        onLongPress={this.onLongPress}
        bottomDivider={true}
        subtitleProps={{ numberOfLines: 1, ellipsizeMode: "tail" }}
        rightIcon={{ name: "chevron-right" }}
      />
    );
  }

  private onLongPress = () => {
    const buttonText = this.props.thread.pinned ? "Unpin thread" : "Pin thread";
    if (this.state.isTogglingPinning) {
      return;
    }
    this.props.showActionSheetWithOptions(
      {
        options: [buttonText, "Cancel"],
        cancelButtonIndex: 1
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          this.togglePinning();
        }
      }
    );
  };

  private togglePinning = () => {
    const { thread, toggleThreadPinning } = this.props;
    this.setState({ isTogglingPinning: true });
    toggleThreadPinning({ variables: { threadId: thread.id } });
  };
}

const getUpdateCache = (groupId: string): ToggleThreadPinningMutationUpdaterFn => (cache, { data }) => {
  const prevData = cache.readQuery<getThreads>({ query: THREADS_QUERY, variables: { groupId } });
  cache.writeQuery({
    query: THREADS_QUERY,
    data: {
      threads: ((prevData && prevData.threads) || []).concat({ ...data!.toggleThreadPinning })
    }
  });
};
const EnhancedComponent = (props: IPublicProps) => (
  <ToggleThreadPinningMutation mutation={TOGGLE_THREAD_PINNING_MUTATION} update={getUpdateCache(props.groupId)}>
    {(toggleThreadPinning, mutationResult) => (
      // @ts-ignore since @expo/react-native-action-sheet types aren't easy
      <ThreadListItem {...props} toggleThreadPinning={toggleThreadPinning} mutationResult={mutationResult} />
    )}
  </ToggleThreadPinningMutation>
);
export default EnhancedComponent;
