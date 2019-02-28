import { Formik, FormikProps } from "formik";
import { get } from "lodash";
import * as React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import * as yup from "yup";

import {
  UPDATE_PERSON_MUTATION,
  UpdatePersonMutation,
  UpdatePersonMutationFn,
  UpdatePersonMutationResult
} from "../../graphql/mutations";
import { OWN_INFO_QUERY, OwnInfoQuery, OwnInfoQueryResult } from "../../graphql/queries";
import { colors } from "../../style/common";
import { FormErrors, FormField, FormLabel, WobblyButton } from "../atoms";

interface IUpdatePersonFormFields {
  // TODO: profile image
  // TODO: change password
  // TODO: change email
  name: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
}

interface IUpdatePersonFormProps {
  updatePerson: UpdatePersonMutationFn;
  updatePersonResult: UpdatePersonMutationResult;
  ownInfoResult: OwnInfoQueryResult;
}

class UpdatePersonForm extends React.Component<IUpdatePersonFormProps> {
  private updatePersonForm?: Formik<IUpdatePersonFormFields> | null;

  public render() {
    const { updatePersonResult, ownInfoResult } = this.props;
    const name = get(ownInfoResult, "data.me.name", "");
    return (
      <Formik
        ref={el => (this.updatePersonForm = el)}
        initialValues={{ name, oldPassword: '', newPassword: '', confirmPassword: '' }}
        enableReinitialize={true} // required for `initialValues` to update when the query completes
        onSubmit={this.handleSubmit}
        validateOnChange={false}
        validationSchema={yup.object().shape({
          name: yup
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name must be fewer than 50 characters")
            .required()
        })}
      >
        {(formikBag: FormikProps<IUpdatePersonFormFields>) => (
          <View>
            <Text
              style={{
                marginTop: 20,
                marginLeft: 8,
                fontWeight: "bold",
              }}>Edit Details</Text>
            <FormErrors
              errors={get(this.props.updatePersonResult, "errors.graphQLErrors", []).map(
                (e: any) => e.message || undefined
              )}
            />
            <FormLabel>Name</FormLabel>
            <FormField
              onChangeText={formikBag.handleChange("name")}
              value={formikBag.values.name}
              backgroundColor={colors.lightGray1}
            />
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 20,
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
              }}
            />
            <Text
              style={{
                marginTop: 20,
                marginLeft: 8,
                fontWeight: "bold",
              }}>Change Password</Text>
            <FormErrors
              errors={get(this.props.updatePersonResult, "errors.graphQLErrors", []).map(
                (e: any) => e.message || undefined
              )}
            />
            <FormLabel>Old Password</FormLabel>
            <FormField
              onChangeText={formikBag.handleChange("oldPassword")}
              value={formikBag.values.oldPassword}
              backgroundColor={colors.lightGray1}
            />
            <FormLabel>New Password</FormLabel>
            <FormField
              onChangeText={formikBag.handleChange("newPassword")}
              value={formikBag.values.newPassword}
              backgroundColor={colors.lightGray1}
            />
            <FormLabel>Confirm</FormLabel>
            <FormField
              onChangeText={formikBag.handleChange("confirmPassword")}
              value={formikBag.values.confirmPassword}
              backgroundColor={colors.lightGray1}
            />
            <WobblyButton onPress={formikBag.handleSubmit} disabled={updatePersonResult.loading}>
              {updatePersonResult.loading ? <ActivityIndicator /> : "Submit"}
            </WobblyButton>
          </View>
        )}
      </Formik>
    );
  }

  private handleSubmit = (vals: IUpdatePersonFormFields) => {
    const { confirmPassword, name, oldPassword, newPassword } = vals;
    this.props
      .updatePerson({
        variables: {
          name,
          newPassword,
          oldPassword
        }
      })
      .catch(e => {
        const error = get(e, "graphQLErrors[0].message", "An error occurred");
        this.updatePersonForm!.setErrors({ name: error });
      });
  };
}

export default () => (
  <OwnInfoQuery query={OWN_INFO_QUERY}>
    {ownInfoResult => (
      <UpdatePersonMutation mutation={UPDATE_PERSON_MUTATION}>
        {(updatePerson, updatePersonResult) => (
          <UpdatePersonForm
            updatePerson={updatePerson}
            updatePersonResult={updatePersonResult}
            ownInfoResult={ownInfoResult}
          />
        )}
      </UpdatePersonMutation>
    )}
  </OwnInfoQuery>
);
