import React, { useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import AppButton from "../components/AppButton";
import ScreenWrapper from "../components/ScreenWrapper";
import useAppNavigation from "../hooks/useAppNavigation";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";

export default function RegistrationScreen() {
    const navigation = useAppNavigation()
    const [mobile, setMobile] = useState("");
    const [name, setName] = useState("");
    const [shop, setShop] = useState("");
    const [city, setCity] = useState("");

    const [errors, setErrors] = useState({
        mobile: "",
        name: "",
        city: "",
    });

    const validate = () => {
        let valid = true;
        let newErrors = { mobile: "", name: "", city: "" };

        // Mobile
        if (!mobile || mobile.length !== 10) {
            newErrors.mobile = "Enter valid 10 digit mobile number";
            valid = false;
        }

        // Name
        if (!name.trim()) {
            newErrors.name = "Name is required";
            valid = false;
        }

        // City
        if (!city.trim()) {
            newErrors.city = "City is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        console.log({
            mobile,
            name,
            shop,
            city,
        });

        navigation.navigate("Dashbaord")

    };

    return (
        <ScreenWrapper>
            <StatusBar barStyle="light-content" />

            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Registration</Text>

                    {/* Mobile */}
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile number"
                        placeholderTextColor="#aaa"
                        keyboardType="number-pad"
                        maxLength={10}
                        value={mobile}
                        onChangeText={(text) => {
                            setMobile(text);
                            setErrors((e) => ({ ...e, mobile: "" }));
                        }}
                    />
                    {errors.mobile ? (
                        <Text style={styles.error}>{errors.mobile}</Text>
                    ) : null}

                    {/* Name */}
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor="#aaa"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setErrors((e) => ({ ...e, name: "" }));
                        }}
                    />
                    {errors.name ? (
                        <Text style={styles.error}>{errors.name}</Text>
                    ) : null}

                    {/* Shop Name */}
                    <TextInput
                        style={styles.input}
                        placeholder="Firm / Shop name (optional)"
                        placeholderTextColor="#aaa"
                        value={shop}
                        onChangeText={setShop}
                    />

                    {/* City */}
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        placeholderTextColor="#aaa"
                        value={city}
                        onChangeText={(text) => {
                            setCity(text);
                            setErrors((e) => ({ ...e, city: "" }));
                        }}
                    />
                    {errors.city ? (
                        <Text style={styles.error}>{errors.city}</Text>
                    ) : null}

                    <AppButton
                        title="Submit"
                        onPress={handleSubmit}
                        style={{ marginTop: 20 }}
                        disabled={!mobile || !name || !city}
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
}

const themeColor = colors.primary;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColor,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 25,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: fonts.bold,
        textAlign: "center",
        marginBottom: 20,
        color: themeColor,
    },
    input: {
        backgroundColor: "#F6F6F6",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        fontFamily: fonts.regular,
        borderColor: "#e5e5e5",
    },
    error: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
        fontFamily: fonts.medium,
    },
});
