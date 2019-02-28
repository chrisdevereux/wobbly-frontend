import { Formik, FormikProps } from "formik";
import { get, values } from "lodash";
import * as React from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";

import { LOGIN_MUTATION, LoginMutation, LoginMutationFn, LoginMutationResult } from "../../graphql/mutations";
import { createNavigatorFunction, saveTokenAndRedirect } from "../../util";
import { FormErrors, FormField, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";
import WobblyText from "../atoms/WobblyText";

export interface ILoginFormFields {
  email: string;
  password: string;
}

interface ILoginScreenProps {
  login: LoginMutationFn;
  result: LoginMutationResult;
}

class LoginScreen extends React.PureComponent<ILoginScreenProps> {
  public static navigationOptions = {
    header: null
  };
  private loginForm?: Formik<ILoginFormFields> | null;

  public componentDidUpdate() {
    const { data } = this.props.result;
    if (data && data.login.token) {
      saveTokenAndRedirect(data.login.token);
    }
  }

  public render() {
    const goToWelcome = createNavigatorFunction("Welcome");
    const isLoggingIn = this.props.result && this.props.result.loading;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.welcome}>
        <WobblyText title2={true} style={styles.welcomeHeading}>
          Login
        </WobblyText>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={this.handleLogin}
          validateOnChange={false}
          ref={el => (this.loginForm = el)}
        >
          {(formikBag: FormikProps<ILoginFormFields>) => (
            <View>
              <FormErrors errors={values(formikBag.errors)} />
              <FormField
                autoCapitalize="none"
                onChangeText={formikBag.handleChange("email")}
                value={formikBag.values.email}
                placeholder="Email"
                keyboardType="email-address"
              />
              <FormField
                autoCapitalize="none"
                onChangeText={formikBag.handleChange("password")}
                value={formikBag.values.password}
                secureTextEntry={true}
                placeholder="Password"
              />
              <WobblyButton
                text="Log in"
                isLoading={isLoggingIn}
                intent={Intent.PRIMARY}
                onPress={formikBag.handleSubmit}
                disabled={isLoggingIn}
              />
              <WobblyButton text="Cancel" onPress={goToWelcome} disabled={isLoggingIn} minimal={true} />
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    );
  }

  private handleLogin = (vals: ILoginFormFields) => {
    this.props
      .login({
        variables: {
          email: vals.email,
          password: vals.password
        }
      })
      .catch(e => {
        const error = get(e, "graphQLErrors[0].message", "An error occurred");
        this.loginForm!.setErrors({ email: error });
      });
  };
}

export default () => (
  <LoginMutation mutation={LOGIN_MUTATION}>
    {(login, result) => <LoginScreen login={login} result={result} />}
  </LoginMutation>
);

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    padding: 20,
    justifyContent: "space-around"
  },
  welcomeHeading: {
    textAlign: "center",
    marginBottom: 10
  }
});
