import xiruilink from "xiruilink-app";

xiruilink.SYSTEM.setReceiveEvent();

export const useXiruilink = (title) => {
  onShow(() => {
    xiruilink.SYSTEM.setWebViewTitle(title);
  });
};

export default xiruilink;
