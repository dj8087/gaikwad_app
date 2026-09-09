import React, { useState } from "react";
import {
    ImageBackground,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSelector } from "react-redux";
import { verifyTokenApi } from "../api/authSlice";
import { getLoggedInUser } from "../api/profileSlice";
import assets from "../assets";
import AppButton from "../components/AppButton";
import AppLoader from "../components/AppLoader";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppNavigation from "../hooks/useAppNavigation";
import { RootState } from "../redux/store";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";
import { showError } from "../utils/toast";
import { useAndroidBackExit } from "../utils/useAndroidBackHandler";

export default function AccessTokenScreen() {
    useAndroidBackExit();
    
    const navigation = useAppNavigation();
    const dispatch = useAppDispatch();
    const [value, setValue] = useState("");

    const { loading, data, error } = useSelector(
        (state: RootState) => state.auth
    );
    const handleChange = (text: string) => {
        const numeric = text.replace(/[^0-9]/g, "");
        if (numeric.length <= 6) {
            setValue(numeric);
        }
    };

    const handleSubmit = async () => {
        try {
            Keyboard.dismiss()
            const res = await dispatch(verifyTokenApi(value)).unwrap();

            await dispatch(
                getLoggedInUser(res.data.customerToken)
            ).unwrap();

            navigation.navigate("Dashbaord");

        } catch (error: any) {
            showError(
                typeof error === "string"
                    ? error
                    : error?.message || "Something went wrong"
            );
        }
    };


    const isDisabled = value.length !== 6;

    return (
        <ImageBackground
            source={assets.images.background}
            style={styles.bg}
            resizeMode="cover"
        >
            <View style={styles.overlay} />

            <View style={styles.wrapper}>
                <Text style={styles.label}>Enter Token</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter 6 digit token"
                    placeholderTextColor="#ccc"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={value}
                    secureTextEntry
                    onChangeText={handleChange}
                />

                <AppButton
                    title="Submit"
                    onPress={handleSubmit}
                    disabled={isDisabled}
                    style={{ marginTop: 25, width: "100%" }}
                />
            </View>
            <AppLoader visible={loading} />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    wrapper: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 25,
    },
    label: {
        fontFamily: fonts.bold,
        fontSize: 22,
        color: "#fff",
        marginBottom: 25,
    },

    input: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 18,
        fontSize: 18,
        fontFamily: fonts.medium,
        color: colors.darkBlue,
        borderWidth: 2,
        borderColor: "#e5e5e5",
        textAlign: 'center',

    },
});
