import { Formik, FormikProps } from "formik";
import hoistNonReactStatics from "hoist-non-react-statics";
import { get, values } from "lodash";
import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";

import { SIGNUP_MUTATION, SignupMutation, SignupMutationFn, SignupMutationResult } from "../../graphql/mutations";
import { createNavigatorFunction, saveTokenAndRedirect } from "../../util";
import { FormErrors, FormField, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";

interface ISignupFormFields {
  email: string;
  displayName: string;
  password: string;
  passwordConfirmation: string;
}

interface ISignupScreenProps {
  signup: SignupMutationFn;
  result: SignupMutationResult;
}

class SignupScreen extends React.PureComponent<ISignupScreenProps> {
  public static navigationOptions = {
    title: "Sign up"
  };

  private signupForm?: Formik<ISignupFormFields> | null;

  public componentDidUpdate() {
    const { data } = this.props.result;
    if (data && data.signup.token) {
      saveTokenAndRedirect(data.signup.token);
    }
  }

  public render() {
    const isSigningUp = this.props.result && this.props.result.loading;
    return (
      <View style={styles.welcome}>
        <KeyboardAwareScrollView>
          <Image source={require("../../../assets/images/pluto/pluto-sign-up.png")} style={styles.image} />
          <Formik
            ref={el => (this.signupForm = el)}
            initialValues={{ email: "", displayName: "", password: "", passwordConfirmation: "" }}
            onSubmit={this.processSignup}
            validateOnChange={false}
            validationSchema={yup.object().shape({
              email: yup
                .string()
                .email("Invalid email")
                .required("Email is required"),
              displayName: yup
                .string()
                .min(3, "Name must be more than 3 characters")
                .max(50, "Name must be fewer than 50 characters")
                .required("A display name is required"),
              password: yup
                .string()
                .min(10, "Password must be at least 10 characters")
                .required("Password is required"),
              passwordConfirmation: yup
                .string()
                .oneOf([yup.ref("password")], "Passwords do not match")
                .required("Password confirmation is required")
            })}
          >
            {(formikBag: FormikProps<ISignupFormFields>) => (
              <View>
                <FormErrors errors={values(formikBag.errors)} />
                <FormField
                  onChangeText={formikBag.handleChange("email")}
                  value={formikBag.values.email}
                  autoCapitalize="none"
                  placeholder="Email"
                  keyboardType="email-address"
                />
                <FormField
                  onChangeText={formikBag.handleChange("displayName")}
                  autoCapitalize="none"
                  value={formikBag.values.displayName}
                  placeholder="Display name"
                />
                <FormField
                  onChangeText={formikBag.handleChange("password")}
                  autoCapitalize="none"
                  value={formikBag.values.password}
                  secureTextEntry={true}
                  placeholder="Password"
                />
                <FormField
                  onChangeText={formikBag.handleChange("passwordConfirmation")}
                  autoCapitalize="none"
                  value={formikBag.values.passwordConfirmation}
                  secureTextEntry={true}
                  placeholder="Confirm password"
                />
                <WobblyButton
                  text="Sign up"
                  isLoading={isSigningUp}
                  intent={Intent.PRIMARY}
                  onPress={formikBag.handleSubmit}
                  disabled={isSigningUp}
                />
                <WobblyButton
                  text="Cancel"
                  onPress={createNavigatorFunction("Welcome")}
                  disabled={isSigningUp}
                  minimal={true}
                />
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  private processSignup = (vals: ISignupFormFields) => {
    this.props
      .signup({
        variables: {
          email: vals.email,
          password: vals.password,
          name: vals.displayName
        }
      })
      .catch(e => {
        const error = get(e, "graphQLErrors[0].message", "An error occurred");
        this.signupForm!.setErrors({ email: error });
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
  <SignupMutation mutation={SIGNUP_MUTATION}>
    {(signup, result) => <SignupScreen signup={signup} result={result} />}
  </SignupMutation>
);

export default hoistNonReactStatics(EnhancedComponent, SignupScreen);
