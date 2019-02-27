import hoistNonReactStatics from "hoist-non-react-statics";
import { remove } from "lodash";
import * as React from "react";
import { Platform, SafeAreaView, StyleSheet } from "react-native";
import { GiftedChat, IMessage, MessageProps } from "react-native-gifted-chat";
import { getBottomSpace, isIphoneX } from "react-native-iphone-x-helper";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { NavigationInjectedProps } from "react-navigation";

import { createPostVariables } from "../../generated/createPost";
import { getPosts, getPosts_posts } from "../../generated/getPosts";
import { getThreads, getThreads_threads } from "../../generated/getThreads";
import {
  CREATE_POST_MUTATION,
  CreatePostMutation,
  CreatePostMutationResult,
  CreatePostMutationUpdaterFn
} from "../../graphql/mutations";
import {
  OWN_INFO_QUERY,
  OwnInfoQuery,
  OwnInfoQueryResult,
  POSTS_QUERY,
  PostsQuery,
  PostsQueryResult,
  THREADS_QUERY
} from "../../graphql/queries";
import { Post } from "../molecules";
import { ErrorState, LoadingState } from "../organisms";

interface IThreadScreenProps extends NavigationInjectedProps {
  postsResult: PostsQueryResult;
  ownInfoResult: OwnInfoQueryResult;
  createPost: (vars: IOptimisticUpdateParams) => void;
  mutationResult: CreatePostMutationResult;
}
class ThreadScreen extends React.Component<IThreadScreenProps> {
  public static navigationOptions = ({ navigation }: NavigationInjectedProps) => ({
    title: navigation.getParam("threadTitle", "Thread")
  });

  private static mapToGiftedChatMessages = (posts: getPosts_posts[]): IMessage[] => {
    return posts.map(post => ({
      _id: post.id,
      text: post.content,
      createdAt: post.createdAt,
      user: {
        _id: post.author.id,
        name: post.author.name
      }
    }));
  };

  public render() {
    const { ownInfoResult, postsResult } = this.props;
    if (ownInfoResult.loading || postsResult.loading) {
      return <LoadingState />;
    } else if (ownInfoResult.error) {
      return <ErrorState subtitle={ownInfoResult.error.message} />;
    } else if (postsResult.error) {
      return <ErrorState subtitle={postsResult.error.message} />;
    }
    const posts = (postsResult.data && postsResult.data!.posts) || [];
    const person = ownInfoResult.data && ownInfoResult.data.me;
    if (!person) {
      throw new Error("Attempted to initialize chat screen without the current account info");
    }
    return (
      <SafeAreaView style={style.container}>
        <GiftedChat
          messages={ThreadScreen.mapToGiftedChatMessages(posts)}
          onSend={this.handleSend}
          isAnimated={true}
          user={{ _id: person.id, name: person.name }}
          showAvatarForEveryMessage={true}
          renderMessage={this.renderMessage}
          bottomOffset={isIphoneX() ? getBottomSpace() : undefined}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
      </SafeAreaView>
    );
  }

  private renderMessage = (props: MessageProps<IMessage>) => <Post {...props} />;

  private handleSend = (messages: IMessage[]) => {
    messages.forEach(msg => {
      this.props.createPost({
        threadId: this.props.navigation.getParam("threadId", ""),
        content: msg.text,
        groupId: this.props.navigation.getParam("groupId", "")
      });
    });
  };
}

const style = StyleSheet.create({
  container: {
    flex: 1
  }
});

const getUpdateCacheFn = (groupId: string, threadId: string): CreatePostMutationUpdaterFn => (cache, { data }) => {
  // Update the cache of posts in the current thread
  const prevPosts = cache.readQuery<getPosts>({ query: POSTS_QUERY, variables: { threadId } })!.posts;
  cache.writeQuery({
    query: POSTS_QUERY,
    variables: {
      threadId
    },
    data: {
      posts: [data!.createPost].concat(prevPosts)
    }
  });

  // Also update the query for threads. This is so we can sort them by recent activity
  const prevThreads = cache.readQuery<getThreads>({ query: THREADS_QUERY, variables: { groupId } })!.threads!;
  const thisThread = remove(prevThreads, (thread: getThreads_threads) => thread.id === threadId)[0];
  // The threads query only asks for the most recent post (which in this case is the one we just created)
  const updatedThreads = [{ ...thisThread, posts: [data!.createPost] }].concat(prevThreads);
  cache.writeQuery({
    query: THREADS_QUERY,
    variables: {
      groupId
    },
    data: {
      threads: updatedThreads
    }
  });
};

interface IOptimisticUpdateParams extends createPostVariables {
  groupId: string;
}
const EnhancedComponent = ({ navigation }: NavigationInjectedProps) => {
  const updateCache = getUpdateCacheFn(navigation.getParam("groupId"), navigation.getParam("threadId"));
  return (
    <OwnInfoQuery query={OWN_INFO_QUERY}>
      {ownInfoResult => (
        <PostsQuery query={POSTS_QUERY} variables={{ threadId: navigation.getParam("threadId", "") }}>
          {postsResult => (
            <CreatePostMutation mutation={CREATE_POST_MUTATION} update={updateCache}>
              {(createPost, mutationResult) => {
                const optimisticCreatePost = ({ threadId, content }: createPostVariables) => {
                  createPost({
                    variables: {
                      threadId,
                      content
                    },
                    optimisticResponse: {
                      createPost: {
                        __typename: "Post",
                        id: "x",
                        content,
                        createdAt: new Date(),
                        author: {
                          __typename: "Person",
                          id: ownInfoResult.data!.me!.id,
                          name: ownInfoResult.data!.me!.name
                        }
                      }
                    },
                    update: updateCache
                  });
                };
                return (
                  <ThreadScreen
                    ownInfoResult={ownInfoResult}
                    postsResult={postsResult}
                    mutationResult={mutationResult}
                    navigation={navigation}
                    createPost={optimisticCreatePost}
                  />
                );
              }}
            </CreatePostMutation>
          )}
        </PostsQuery>
      )}
    </OwnInfoQuery>
  );
};

export default hoistNonReactStatics(EnhancedComponent, ThreadScreen);
