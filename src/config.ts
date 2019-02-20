import { NativeModules } from "react-native";
import url from "url";

const configs = {
  local: {
    backendUrl: getPackagerBaseUrl() + ":4000"
  },
  develop: {
    backendUrl: "http://develop.wobbly.app"
  }
};

export const config = __DEV__ ? configs.local : configs.develop;

function getPackagerBaseUrl() {
  if (!NativeModules.SourceCode || !NativeModules.SourceCode.scriptURL) {
    return "";
  }

  const scriptURL = url.parse(NativeModules.SourceCode.scriptURL);
  return scriptURL.protocol + "//" + scriptURL.hostname;
}
