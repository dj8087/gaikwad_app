import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { StackActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { getLoggedInUser, clearProfile } from "../api/profileSlice";
import { logoutCustomer } from "../api/authSlice";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppNavigation from "../hooks/useAppNavigation";
import { RootState } from "../redux/store";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";
import { showError, showSuccess } from "../utils/toast";

type InfoRowProps = {
  icon: React.ComponentProps<typeof Icon>["name"];
  label: string;
  value?: string | number | null;
};

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { data, loading, error } = useSelector((state: RootState) => state.profile);
  const [loggingOut, setLoggingOut] = useState(false);
  const user = data?.data;

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }
    setLoggingOut(true);

    try {
      await dispatch(logoutCustomer()).unwrap();
      dispatch(clearProfile());
      showSuccess("Logout successful.");
      const rootNavigation = navigation.getParent();
      if (!rootNavigation) {
        throw new Error("Unable to open the access code screen.");
      }
      rootNavigation.dispatch(StackActions.replace("AccessCode"));
    } catch (logoutError) {
      showError(
        typeof logoutError === "string"
          ? logoutError
          : "Unable to log out. Please try again."
      );
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AppHeader title="Profile" showBack={false} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.messageContainer}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.message}>Loading profile...</Text>
          </View>
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : user ? (
          <>
            <View style={styles.headerCard}>
              <Icon name="account-circle" size={70} color={colors.roseGold} />
              <Text style={styles.name}>{user.name || "Customer"}</Text>
              <Text style={styles.firm}>{user.firmName || "-"}</Text>
            </View>

            <View style={styles.infoCard}>
              <InfoRow icon="phone" label="Mobile" value={user.mobile} />
              <InfoRow icon="city" label="City" value={user.city} />
              <InfoRow icon="identifier" label="ERP Customer ID" value={user.erpCustomerId} />
              <InfoRow icon="clock-outline" label="Last Visited" value={user.lastVisited} />
            </View>
          </>
        ) : (
          <Text style={styles.message}>Profile data is not available.</Text>
        )}

        <AppButton
          title={loggingOut ? "Logging out..." : "Logout"}
          onPress={handleLogout}
          disabled={loggingOut}
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Icon name={icon} size={22} color={colors.roseGold} style={styles.rowIcon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value ?? "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    padding: 18,
  },
  content: {
    paddingBottom: 30,
  },
  messageContainer: {
    alignItems: "center",
    paddingVertical: 28,
  },
  message: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 24,
  },
  error: {
    color: "#B42318",
    fontFamily: fonts.regular,
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 24,
  },
  headerCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 20,
  },
  name: {
    color: colors.darkBlue,
    fontFamily: fonts.bold,
    fontSize: 22,
    marginTop: 8,
  },
  firm: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 16,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowIcon: {
    marginRight: 8,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  value: {
    color: colors.darkBlue,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  logoutButton: {
    width: "100%",
  },
});
