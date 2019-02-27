import { Formik, FormikProps } from "formik";
import hoistNonReactStatics from "hoist-non-react-statics";
import { get, values } from "lodash";
import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { LOGIN_MUTATION, LoginMutation, LoginMutationFn, LoginMutationResult } from "../../graphql/mutations";
import { createNavigatorFunction, saveTokenAndRedirect } from "../../util";
import { FormErrors, FormField, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";

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
    title: "Login"
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
      <KeyboardAwareScrollView>
        <View style={styles.welcome}>
          <Image source={require("../../../assets/images/pluto/pluto-sign-in.png")} style={styles.image} />
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
        </View>
      </KeyboardAwareScrollView>
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

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  image: {
    flex: 0,
    height: 250,
    width: "100%",
    resizeMode: "contain"
  },
  welcomeHeading: {
    textAlign: "center",
    marginBottom: 10
  }
});

const EnhancedComponent = () => (
  <LoginMutation mutation={LOGIN_MUTATION}>
    {(login, result) => <LoginScreen login={login} result={result} />}
  </LoginMutation>
);
export default hoistNonReactStatics(EnhancedComponent, LoginScreen);
