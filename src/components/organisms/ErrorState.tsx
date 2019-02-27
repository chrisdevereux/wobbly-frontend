import * as React from "react";

import { NonIdealState } from "../molecules";

interface IErrorStateProps {
  title?: string;
  subtitle?: string;
}
const ErrorState: React.FC<IErrorStateProps> = ({ title, subtitle }) => (
  <NonIdealState
    title={title || "An error occurred"}
    subtitle={subtitle}
    imageRequire={require("../../../assets/images/pluto/pluto-fatal-error.png")}
  />
);
export default ErrorState;
