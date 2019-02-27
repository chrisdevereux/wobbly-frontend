import { ApolloError } from "apollo-client";
import { Formik, FormikProps } from "formik";
import hoistNonReactStatics from "hoist-non-react-statics";
import { values } from "lodash";
import * as React from "react";
import { Image, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";

import { getGroups } from "../../generated/getGroups";
import {
  CREATE_GROUP_MUTATION,
  CreateGroupMutation,
  CreateGroupMutationFn,
  CreateGroupMutationResult,
  CreateGroupMutationUpdaterFn
} from "../../graphql/mutations";
import { GROUPS_QUERY } from "../../graphql/queries";
import { NavigationService } from "../../services";
import { FormErrors, FormField, FormLabel, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";

interface ICreateGroupFormFields {
  name: string;
  description: string;
}
interface ICreateGroupScreenProps {
  createGroup: CreateGroupMutationFn;
  result: CreateGroupMutationResult;
}

class CreateGroupScreen extends React.Component<ICreateGroupScreenProps> {
  public static navigationOptions = {
    title: "Create group"
  };
  private createGroupForm?: Formik<ICreateGroupFormFields> | null;

  public render() {
    const { result } = this.props;
    return (
      <KeyboardAwareScrollView>
        <Image source={require("../../../assets/images/pluto/pluto-uploading-1.png")} style={style.image} />
        <Formik
          ref={el => (this.createGroupForm = el)}
          initialValues={{ name: "", description: "" }}
          onSubmit={this.handleCreateGroup}
          validateOnChange={false}
          validationSchema={yup.object().shape({
            name: yup
              .string()
              .min(10)
              .required(),
            description: yup.string().max(500)
          })}
        >
          {(formikBag: FormikProps<ICreateGroupFormFields>) => (
            <KeyboardAwareScrollView>
              <FormErrors errors={values(formikBag.errors)} />
              <FormLabel>Group name</FormLabel>
              <FormField onChangeText={formikBag.handleChange("name")} value={formikBag.values.name} />
              <FormLabel>Description</FormLabel>
              <FormField
                onChangeText={formikBag.handleChange("description")}
                value={formikBag.values.description}
                multiline={true}
                multilineGrow={true}
              />
              <WobblyButton
                text="Submit"
                isLoading={result.loading}
                intent={Intent.PRIMARY}
                onPress={formikBag.handleSubmit}
                disabled={result.loading}
              />
            </KeyboardAwareScrollView>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    );
  }

  private handleCreateGroup = (vals: ICreateGroupFormFields) => {
    this.props
      .createGroup({ variables: { name: vals.name, description: vals.description } })
      .then(result => {
        if (result && !result.errors) {
          const group = result.data!.createGroup;
          NavigationService.navigate("ThreadsList", { groupName: group.name, groupId: group.id });
        }
      })
      .catch((e: ApolloError) => {
        if (e && e.graphQLErrors) {
          this.createGroupForm!.setErrors({ name: e.graphQLErrors[0].message });
        }
      });
  };
}

const style = StyleSheet.create({
  image: {
    flex: 0,
    width: "100%",
    height: 300,
    resizeMode: "contain"
  }
});

const updateCache: CreateGroupMutationUpdaterFn = (cache, { data }) => {
  const prevData = cache.readQuery<getGroups>({ query: GROUPS_QUERY });
  cache.writeQuery({
    query: GROUPS_QUERY,
    data: {
      groups: (prevData!.groups || []).concat({ ...data!.createGroup, memberCount: 1 })
    }
  });
};
const EnhancedComponent = () => (
  <CreateGroupMutation mutation={CREATE_GROUP_MUTATION} update={updateCache}>
    {(createGroup, result) => <CreateGroupScreen createGroup={createGroup} result={result} />}
  </CreateGroupMutation>
);

export default hoistNonReactStatics(EnhancedComponent, CreateGroupScreen);
