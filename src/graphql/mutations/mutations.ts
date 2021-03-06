import gql from "graphql-tag";

import { postListDetailsFragment, threadListDetailsFragment } from "../fragments";

export const SIGNUP_MUTATION = gql`
  mutation signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

export const UPDATE_PERSON_MUTATION = gql`
  mutation updatePerson($email: String, $password: String, $name: String) {
    updatePerson(email: $email, password: $password, name: $name) {
      name
      email
    }
  }
`;

export const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($name: String!, $description: String) {
    createGroup(name: $name, description: $description) {
      name
      description
      id
    }
  }
`;

export const JOIN_GROUP_MUTATION = gql`
  mutation joinGroup($groupId: ID!) {
    joinGroup(groupId: $groupId) {
      id
      name
      memberCount
    }
  }
`;

export const LEAVE_GROUP_MUTATION = gql`
  mutation leaveGroup($groupId: ID!) {
    leaveGroup(groupId: $groupId) {
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_THREAD_MUTATION = gql`
  mutation createThread($groupId: ID!, $title: String!, $content: String!) {
    createThread(groupId: $groupId, title: $title, content: $content) {
      ...ThreadListDetails
    }
  }
  ${threadListDetailsFragment}
`;

export const TOGGLE_THREAD_PINNING_MUTATION = gql`
  mutation toggleThreadPinning($threadId: ID!) {
    toggleThreadPinning(threadId: $threadId) {
      ...ThreadListDetails
    }
  }
  ${threadListDetailsFragment}
`;

export const CREATE_POST_MUTATION = gql`
  mutation createPost($threadId: ID!, $content: String!) {
    createPost(threadId: $threadId, content: $content) {
      ...PostListDetails
    }
  }
  ${postListDetailsFragment}
`;

export const CONFIRM_EMAIL_MUTATION = gql`
  mutation confirmEmail($confirmationCode: String!) {
    confirmEmail(confirmationCode: $confirmationCode) {
      emailConfirmed
    }
  }
`;
