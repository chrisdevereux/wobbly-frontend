import * as React from "react";

import { Footer, WobblyButton } from "../atoms";
import { Intent } from "../atoms/WobblyButton";

interface ICreateGroupFooterProps {
  onButtonPress: () => void;
}
const CreateGroupFooter: React.SFC<ICreateGroupFooterProps> = ({ onButtonPress }) => {
  const button = <WobblyButton text="Create new group" intent={Intent.PRIMARY} onPress={onButtonPress} />;
  return <Footer text="Didn't find what you were looking for?" button={button} />;
};
export default CreateGroupFooter;
