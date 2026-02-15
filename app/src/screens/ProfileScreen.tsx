import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { logout } from "../api/authSlice";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppNavigation from "../hooks/useAppNavigation";
import { RootState } from "../redux/store";
import colors from "../theme/colors";
import { showSuccess } from "../utils/toast";

interface InfoRowProps {
  icon: string;
  label: string;
  value: string | number | null;
}

export default function ProfileScreen() {
    const dispatch = useAppDispatch()
    const navigation = useAppNavigation()
    const { data, loading, error } = useSelector((state: RootState) => state.profile);
    const user = data?.data;

    if (loading) return <Text style={styles.loading}>Loading Profile...</Text>;
    if (error) return <Text style={styles.error}>{error}</Text>;

    if (!user) return null;

    return (
        <>
            <AppHeader title="Profile" onBackPress={()=> navigation.goBack()} />
            <View style={styles.container}>
                <View style={styles.headerCard}>
                    <Icon name="account-circle" size={70} color="#4A90E2" />
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.firm}>{user.firmName}</Text>
                </View>

                <View style={styles.infoCard}>
                    <InfoRow icon="phone" label="Mobile" value={user.mobile} />
                    <InfoRow icon="city" label="City" value={user.city} />
                    <InfoRow icon="identifier" label="ERP Customer ID" value={user.erpCustomerId} />
                    <InfoRow icon="clock-outline" label="Last Visited" value={user.lastVisited} />
                </View>

                <AppButton
                    onPress={() => { 
                        dispatch(logout()) 
                        showSuccess("Logout success!")
                        navigation.navigate("AccessTokenScreen")
                    }}
                    title="Logout"
                />
            </View>
        </>
    );
}


const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Icon name={icon} size={22} color="#4A90E2" style={{ marginRight: 8 }} />
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={styles.value}>{value ?? "-"}</Text>
  </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        backgroundColor: colors.white,
    },

    loading: { textAlign: "center", marginTop: 20, fontSize: 16 },
    error: { textAlign: "center", marginTop: 20, fontSize: 16, color: "red" },

    headerCard: {
        backgroundColor: "#FFF",
        padding: 20,
        alignItems: "center",
        marginBottom: 20,
    },

    name: {
        fontSize: 22,
        fontWeight: "700",
        marginTop: 8,
        color: "#333",
    },

    firm: {
        fontSize: 16,
        color: "#666",
        marginTop: 4,
    },

    infoCard: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 15,
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

    label: {
        fontSize: 15,
        color: "#555",
    },

    value: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
});
