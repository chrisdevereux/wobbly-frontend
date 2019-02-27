import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, AvatarProps, BubbleProps, Day, DayProps, MessageProps, utils } from "react-native-gifted-chat";

import { PostBubble } from "../atoms";

const { isSameUser, isSameDay } = utils;

class Post extends React.PureComponent<MessageProps> {
  public render() {
    const { currentMessage } = this.props;
    if (!currentMessage) {
      return;
    }

    const marginBottom = isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10;
    return (
      <View>
        {this.renderDate()}
        <View style={[style.container, { marginBottom }]}>
          {this.renderAvatar()}
          {this.renderBubble()}
        </View>
      </View>
    );
  }

  private renderDate = () => {
    if (!this.props.currentMessage!.createdAt) {
      return;
    }
    return <Day {...this.getDayProps()} />;
  };

  private renderAvatar = () => {
    const avatarProps = this.getAvatarProps();
    if (this.props.renderAvatar) {
      return this.props.renderAvatar(avatarProps);
    }
    // Only show avatar for first message in a series, or if it's a new day
    let heightStyle;
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      heightStyle = { height: 0 };
    }
    return <Avatar {...avatarProps} imageStyle={{ left: [style.avatar, heightStyle], right: [] }} />;
  };

  private renderBubble = () => {
    const bubbleProps = this.getBubbleProps();
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <PostBubble {...bubbleProps} />;
  };

  private getBubbleProps = (): BubbleProps => {
    const { containerStyle, ...props } = this.props;
    return {
      // Work around shoddy types in react-native-gifted-chat
      user: this.props.currentMessage!.user!,
      wrapperStyle: { left: [], right: [] },
      bottomContainerStyle: { left: [], right: [] },
      tickStyle: {},
      containerToNextStyle: { left: [], right: [] },
      containerToPreviousStyle: { left: [], right: [] },
      // These can all be overridden
      ...props
    };
  };

  private getAvatarProps = (): AvatarProps => {
    const { containerStyle, ...props } = this.props;
    return {
      // Work around shoddy types in react-native-gifted-chat
      currentMessage: this.props.currentMessage!,
      previousMessage: this.props.previousMessage!,
      nextMessage: this.props.nextMessage!,
      renderAvatarOnTop: false,
      onPressAvatar: () => undefined,
      containerStyle: { left: [], right: [] },
      imageStyle: { left: [], right: [] },
      isSameDay,
      isSameUser,
      // These can all be overridden...
      ...props,
      // Except this one. We don't distinguish between left/right posts.
      position: "left"
    } as any;
  };

  private getDayProps = (): DayProps => {
    const { containerStyle, ...props } = this.props;
    return {
      ...props
    };
  };
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginHorizontal: 8,
    paddingTop: 5
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 3
  }
});

export default Post;
