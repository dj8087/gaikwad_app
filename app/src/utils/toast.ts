// utils/toast.ts
import Toast from "react-native-toast-message";

export const showSuccess = (msg: string) =>
  Toast.show({ type: "success", text1: msg });

export const showError = (msg: string) =>
  Toast.show({ type: "error", text1: msg });

export const showWarning = (msg: string) =>
  Toast.show({ type: "warning", text1: msg });
