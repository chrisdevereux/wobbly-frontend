import { ApolloError } from "apollo-client";
import { Formik, FormikProps } from "formik";
import hoistNonReactStatics from "hoist-non-react-statics";
import { values } from "lodash";
import * as React from "react";
import { Button } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationInjectedProps } from "react-navigation";
import * as yup from "yup";

import { getThreads } from "../../generated/getThreads";
import {
  CREATE_THREAD_MUTATION,
  CreateThreadMutation,
  CreateThreadMutationFn,
  CreateThreadMutationResult,
  CreateThreadMutationUpdaterFn
} from "../../graphql/mutations";
import { THREADS_QUERY } from "../../graphql/queries";
import { NavigationService } from "../../services";
import { FormErrors, FormField, FormLabel, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";

interface ICreateThreadFormFields {
  title: string;
  content: string;
}
interface ICreateThreadScreenProps extends NavigationInjectedProps {
  createThread: CreateThreadMutationFn;
  result: CreateThreadMutationResult;
}
class CreateThreadScreen extends React.Component<ICreateThreadScreenProps> {
  public static navigationOptions = {
    title: "New thread",
    headerRight: <Button type="clear" title="Cancel" onPress={NavigationService.goBack} />
  };
  private createThreadForm?: Formik<ICreateThreadFormFields> | null;

  public render() {
    const { result } = this.props;
    return (
      <Formik
        ref={el => (this.createThreadForm = el)}
        initialValues={{ title: "", content: "" }}
        onSubmit={this.handleCreateThread}
        validateOnChange={false}
        validationSchema={yup.object().shape({
          title: yup
            .string()
            .min(1)
            .max(60)
            .required(),
          content: yup.string().required()
        })}
      >
        {(formikBag: FormikProps<ICreateThreadFormFields>) => (
          <KeyboardAwareScrollView>
            <FormErrors errors={values(formikBag.errors)} />
            <FormLabel>Title</FormLabel>
            <FormField onChangeText={formikBag.handleChange("title")} value={formikBag.values.title} />
            <FormLabel>Content</FormLabel>
            <FormField
              onChangeText={formikBag.handleChange("content")}
              value={formikBag.values.content}
              multiline={true}
              multilineGrow={true}
            />
            <WobblyButton
              intent={Intent.PRIMARY}
              text="Submit"
              isLoading={result.loading}
              onPress={formikBag.handleSubmit}
              disabled={result.loading}
            />
          </KeyboardAwareScrollView>
        )}
      </Formik>
    );
  }

  private handleCreateThread = (vals: ICreateThreadFormFields) => {
    const groupId = this.props.navigation.getParam("groupId", "");
    const groupName = this.props.navigation.getParam("groupName", "");
    this.props
      .createThread({
        variables: {
          groupId,
          title: vals.title,
          content: vals.content
        }
      })
      .then(() => {
        NavigationService.navigate("ThreadsList", { groupId, groupName });
      })
      .catch((e: ApolloError) => {
        if (e && e.graphQLErrors) {
          this.createThreadForm!.setErrors({ title: e.graphQLErrors[0].message });
        }
      });
  };
}

const getUpdateCacheFn = (groupId: string): CreateThreadMutationUpdaterFn => (cache, { data }) => {
  const prevData = cache.readQuery<getThreads>({ query: THREADS_QUERY, variables: { groupId } });
  cache.writeQuery({
    query: THREADS_QUERY,
    variables: { groupId },
    data: {
      threads: [data!.createThread].concat(prevData!.threads || [])
    }
  });
};

const EnhancedComponent = ({ navigation }: NavigationInjectedProps) => (
  <CreateThreadMutation mutation={CREATE_THREAD_MUTATION} update={getUpdateCacheFn(navigation.getParam("groupId"))}>
    {(createThread, result) => (
      <CreateThreadScreen createThread={createThread} result={result} navigation={navigation} />
    )}
  </CreateThreadMutation>
);
export default hoistNonReactStatics(EnhancedComponent, CreateThreadScreen);
