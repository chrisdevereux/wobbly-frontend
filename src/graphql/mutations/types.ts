// tslint:disable:max-classes-per-file
import { Mutation, MutationFn, MutationResult, MutationUpdaterFn } from "react-apollo";

import { confirmEmail, confirmEmailVariables } from "../../generated/confirmEmail";
import { createGroup, createGroupVariables } from "../../generated/createGroup";
import { createPost, createPostVariables } from "../../generated/createPost";
import { createThread, createThreadVariables } from "../../generated/createThread";
import { joinGroup, joinGroupVariables } from "../../generated/joinGroup";
import { leaveGroup, leaveGroupVariables } from "../../generated/leaveGroup";
import { login, loginVariables } from "../../generated/login";
import { signup, signupVariables } from "../../generated/signup";
import { toggleThreadPinning, toggleThreadPinningVariables } from "../../generated/toggleThreadPinning";
import { updateGroup, updateGroupVariables } from "../../generated/updateGroup";
import { updatePerson, updatePersonVariables } from "../../generated/updatePerson";

export class SignupMutation extends Mutation<signup, signupVariables> {}
export type SignupMutationFn = MutationFn<signup, signupVariables>;
export type SignupMutationResult = MutationResult<signup>;

export class LoginMutation extends Mutation<login, loginVariables> {}
export type LoginMutationFn = MutationFn<login, loginVariables>;
export type LoginMutationResult = MutationResult<login>;

export class ConfirmEmailMutation extends Mutation<confirmEmail, confirmEmailVariables> {}
export type ConfirmEmailMutationFn = MutationFn<confirmEmail, confirmEmailVariables>;
export type ConfirmEmailMutationResult = MutationResult<confirmEmail>;

export class UpdatePersonMutation extends Mutation<updatePerson, updatePersonVariables> {}
export type UpdatePersonMutationFn = MutationFn<updatePerson, updatePersonVariables>;
export type UpdatePersonMutationResult = MutationResult<updatePerson>;

export class JoinGroupMutation extends Mutation<joinGroup, joinGroupVariables> {}
export type JoinGroupMutationFn = MutationFn<joinGroup, joinGroupVariables>;
export type JoinGroupMutationResult = MutationResult<joinGroup>;
export type JoinGroupMutationUpdaterFn = MutationUpdaterFn<joinGroup>;

export class LeaveGroupMutation extends Mutation<leaveGroup, leaveGroupVariables> {}
export type LeaveGroupMutationFn = MutationFn<leaveGroup, leaveGroupVariables>;
export type LeaveGroupMutationResult = MutationResult<leaveGroup>;
export type LeaveGroupMutationUpdaterFn = MutationUpdaterFn<leaveGroup>;

export class CreateGroupMutation extends Mutation<createGroup, createGroupVariables> {}
export type CreateGroupMutationFn = MutationFn<createGroup, createGroupVariables>;
export type CreateGroupMutationResult = MutationResult<createGroup>;
export type CreateGroupMutationUpdaterFn = MutationUpdaterFn<createGroup>;

export class UpdateGroupMutation extends Mutation<updateGroup, updateGroupVariables> {}
export type UpdateGroupMutationFn = MutationFn<updateGroup, updateGroupVariables>;
export type UpdateGroupMutationResult = MutationResult<updateGroup>;

export class CreateThreadMutation extends Mutation<createThread, createThreadVariables> {}
export type CreateThreadMutationFn = MutationFn<createThread, createThreadVariables>;
export type CreateThreadMutationResult = MutationResult<createThread>;
export type CreateThreadMutationUpdaterFn = MutationUpdaterFn<createThread>;

export class ToggleThreadPinningMutation extends Mutation<toggleThreadPinning, toggleThreadPinningVariables> {}
export type ToggleThreadPinningMutationFn = MutationFn<toggleThreadPinning, toggleThreadPinningVariables>;
export type ToggleThreadPinningMutationResult = MutationResult<toggleThreadPinning>;
export type ToggleThreadPinningMutationUpdaterFn = MutationUpdaterFn<toggleThreadPinning>;

export class CreatePostMutation extends Mutation<createPost, createPostVariables> {}
export type CreatePostMutationFn = MutationFn<createPost, createPostVariables>;
export type CreatePostMutationResult = MutationResult<createPost>;
export type CreatePostMutationUpdaterFn = MutationUpdaterFn<createPost>;
