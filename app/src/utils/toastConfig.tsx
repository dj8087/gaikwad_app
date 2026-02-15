// toastConfig.ts
import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props : any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4BB543" }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
      text2Style={{ fontSize: 14 }}
    />
  ),

  error: (props : any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#D9534F" }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
      text2Style={{ fontSize: 14 }}
    />
  ),

  warning: (props : any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#F0AD4E" }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
    />
  ),
};
