import { Formik, FormikProps } from "formik";
import { get } from "lodash";
import * as React from "react";
import { View } from "react-native";
import * as yup from "yup";

import {
  UPDATE_PERSON_MUTATION,
  UpdatePersonMutation,
  UpdatePersonMutationFn,
  UpdatePersonMutationResult
} from "../../graphql/mutations";
import { OWN_INFO_QUERY, OwnInfoQuery, OwnInfoQueryResult } from "../../graphql/queries";
import { FormErrors, FormField, FormLabel, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";

interface IUpdatePersonFormFields {
  // TODO: profile image
  // TODO: change password
  // TODO: change email
  name: string;
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
        initialValues={{ name }}
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
            <FormErrors
              errors={get(this.props.updatePersonResult, "errors.graphQLErrors", []).map(
                (e: any) => e.message || undefined
              )}
            />
            <FormLabel>Name</FormLabel>
            <FormField onChangeText={formikBag.handleChange("name")} value={formikBag.values.name} />
            <WobblyButton
              text="Submit"
              isLoading={updatePersonResult.loading}
              intent={Intent.PRIMARY}
              onPress={formikBag.handleSubmit}
              disabled={updatePersonResult.loading}
            />
          </View>
        )}
      </Formik>
    );
  }

  private handleSubmit = (vals: IUpdatePersonFormFields) => {
    this.props
      .updatePerson({
        variables: {
          name: vals.name
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
