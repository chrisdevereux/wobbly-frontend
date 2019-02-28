import { Formik, FormikProps } from "formik";
import { get, values } from "lodash";
import * as React from "react";
import { View } from "react-native";
import * as yup from "yup";

import {
  CONFIRM_EMAIL_MUTATION,
  ConfirmEmailMutation,
  ConfirmEmailMutationFn,
  ConfirmEmailMutationResult
} from "../../graphql/mutations";
import { OWN_INFO_QUERY, OwnInfoQuery, OwnInfoQueryResult } from "../../graphql/queries";
import { colors } from "../../style/common";
import { WobblyButton } from "../atoms";
import FormErrors from "../atoms/FormErrors";
import FormField from "../atoms/FormField";
import FormLabel from "../atoms/FormLabel";

export interface ISettingsFields {
  confirmationCode: string;
}

interface ISettingsProps {
  confirmEmail: ConfirmEmailMutationFn;
  result: ConfirmEmailMutationResult;
  ownInfoResult: OwnInfoQueryResult;
}

class SettingsScreen extends React.PureComponent<ISettingsProps> {
  public static navigationOptions = {
    title: "Settings"
  };

  public state = {
    emailConfirmed: false
  };

  private settingsForm?: Formik<ISettingsFields> | null;

  public componentDidMount() {
    const { ownInfoResult } = this.props;
    const emailConfirmed = get(ownInfoResult, "data.me.emailConfirmed", "");
    this.setState({
      emailConfirmed
    });
  }

  public render() {
    return (
      <Formik
        initialValues={{ confirmationCode: "" }}
        ref={el => (this.settingsForm = el)}
        onSubmit={this.handleSubmit}
        validateOnChange={false}
        validationSchema={yup.object().shape({
          confirmationCode: yup.string().required()
        })}
      >
        {(formikBag: FormikProps<ISettingsFields>) => (
          <View>
            <FormErrors errors={values(formikBag.errors)} />
            <FormLabel>Confirm Email</FormLabel>
            <FormField
              disabled={this.state.emailConfirmed}
              onChangeText={formikBag.handleChange("confirmationCode")}
              value={formikBag.values.confirmationCode}
              backgroundColor={colors.lightGray1}
            />
            <WobblyButton disabled={this.state.emailConfirmed} onPress={formikBag.handleSubmit}>
              {this.state.emailConfirmed ? "Good job!" : "Submit"}
            </WobblyButton>
          </View>
        )}
      </Formik>
    );
  }

  private handleSubmit = (vals: ISettingsFields) => {
    this.setState({
      emailConfirmed: false
    });
    this.props
      .confirmEmail({
        variables: {
          confirmationCode: vals.confirmationCode
        }
      })
      .then(() => {
        this.setState({
          emailConfirmed: true
        });
      })
      .catch(e => {
        const error = get(e, "graphQLErrors[0].message", "An error occurred");
        this.settingsForm!.setErrors({ confirmationCode: error });
      }); // setSubmitting(false);
  };
}

export default () => (
  <OwnInfoQuery query={OWN_INFO_QUERY}>
    {ownInfoResult => (
      <ConfirmEmailMutation mutation={CONFIRM_EMAIL_MUTATION}>
        {(confirmEmail, result) => (
          <SettingsScreen ownInfoResult={ownInfoResult} confirmEmail={confirmEmail} result={result} />
        )}
      </ConfirmEmailMutation>
    )}
  </OwnInfoQuery>
);
