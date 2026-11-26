import { StackActions } from "@react-navigation/native";
import type { RemoteMessage } from "@react-native-firebase/messaging";
import { Alert, Platform } from "react-native";
import { fetchDesignDetails, fetchProductDesigns } from "../api/productDesignSlice";
import { store } from "../redux/store";
import { navigationRef } from "../navigation/navigationRef";
import { showError, showWarning } from "../utils/toast";

interface PendingProductNotification {
  productId: string;
  message?: string;
}

let pendingProductNotification: PendingProductNotification | null = null;
let openingProduct = false;

function getProductId(message: RemoteMessage) {
  const productId = message.data?.productId;
  return typeof productId === "string" ? productId.trim() || null : null;
}

function getNotificationMessage(message: RemoteMessage) {
  const body = message.notification?.body;
  if (typeof body === "string" && body.trim()) {
    return body.trim();
  }

  const dataMessage = message.data?.message;
  return typeof dataMessage === "string" && dataMessage.trim()
    ? dataMessage.trim()
    : undefined;
}

function openPendingProductNotification() {
  if (
    !pendingProductNotification ||
    openingProduct ||
    !navigationRef.isReady()
  ) {
    return;
  }

  const { auth, productType } = store.getState();
  if (!auth.customerToken || !productType.selected) {
    return;
  }

  const { productId, message } = pendingProductNotification;
  pendingProductNotification = null;
  openingProduct = true;

  void Promise.all([
    store.dispatch(fetchDesignDetails({ productId })).unwrap(),
    store.dispatch(fetchProductDesigns({ productId })).unwrap(),
  ])
    .then(([design]) => {
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          StackActions.push("ProductDetail", {
            design,
            notificationMessage: message,
          })
        );
      }
    })
    .catch((error: unknown) => {
      showError(
        typeof error === "string"
          ? error
          : "Unable to open the product from this notification."
      );
    })
    .finally(() => {
      openingProduct = false;
      openPendingProductNotification();
    });
}

function openProductFromNotification(message: RemoteMessage) {
  const productId = getProductId(message);
  if (!productId) {
    showWarning("This notification does not include a product link.");
    return;
  }

  pendingProductNotification = {
    productId,
    message: getNotificationMessage(message),
  };
  openPendingProductNotification();
}

function showForegroundNotification(message: RemoteMessage) {
  const productId = getProductId(message);
  const dataTitle = message.data?.title;
  const notificationMessage = getNotificationMessage(message);
  const title =
    message.notification?.title ||
    (typeof dataTitle === "string" ? dataTitle : null) ||
    "Product availability";
  const body = productId
    ? "Tap View product to read this update."
    : notificationMessage || "A product update is available.";

  Alert.alert(
    title,
    body,
    productId
      ? [
          { text: "Dismiss", style: "cancel" },
          {
            text: "View product",
            onPress: () => openProductFromNotification(message),
          },
        ]
      : [{ text: "OK" }]
  );
}

export function processPendingNotification() {
  openPendingProductNotification();
}

export function startNotificationListeners() {
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return () => undefined;
  }

  let active = true;
  const unsubscribeListeners: (() => void)[] = [];
  const unsubscribeStore = store.subscribe(openPendingProductNotification);

  const registerListeners = async () => {
    const messaging = await import("@react-native-firebase/messaging");
    if (!active) {
      return;
    }

    const messagingInstance = messaging.getMessaging();
    unsubscribeListeners.push(
      messaging.onMessage(messagingInstance, showForegroundNotification)
    );
    unsubscribeListeners.push(
      messaging.onNotificationOpenedApp(
        messagingInstance,
        openProductFromNotification
      )
    );

    const initialNotification =
      await messaging.getInitialNotification(messagingInstance);
    if (active && initialNotification) {
      openProductFromNotification(initialNotification);
    }
  };

  void registerListeners().catch((error: unknown) => {
    console.error("Unable to initialize notification listeners.", error);
  });

  return () => {
    active = false;
    unsubscribeStore();
    unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
  };
}
