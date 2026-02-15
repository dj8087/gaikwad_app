import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import assets from "../assets";
import colors from "../theme/colors";
import { fonts } from "../theme/fonts";

interface NoDataProps {
    height?: number;
    imageSource?: any;
}

export default function NoData({
    height = 250,
    imageSource = assets.images.nodata,
}: NoDataProps) {
    return (
        <View style={[styles.container, { height }]}>
            <Image
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={{ fontFamily: fonts.semi, fontSize: 24, marginTop: 25 }}>No Data Available</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        width: "100%",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 120,
        height: 120,
        opacity: 0.9,
    },
});