import colors from "@/app/src/theme/colors";
import { fonts } from "@/app/src/theme/fonts";
import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
    slide: {
        width,
        backgroundColor: colors.primary,
    },

    /* IMAGE */
    imageContainer: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: "100%",
        height: height * 0.5,
        backgroundColor: "#F6F6F6",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },

    /* STOCK BADGE */
    stockBadge: {
        position: "absolute",
        top: 20,
        right : 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    stockText: {
        color: "#fff",
        fontSize: 12,
        letterSpacing: 1,
        fontFamily: fonts.medium
    },

    /* ARROWS */
    leftArrow: {
        position: "absolute",
        left: 10,
        top: "50%",
        opacity: 0.7,
    },
    rightArrow: {
        position: "absolute",
        right: 10,
        top: "50%",
        opacity: 0.7,
    },

    /* DETAILS */
    detailsCard: {
        marginTop: -24,
        marginHorizontal: 16,
        padding: 20,
        borderRadius: 16,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },

    selector: {
        fontSize: 18,
        fontFamily: fonts.bold,
        marginBottom: 12,
        color: "#222",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    label: {
        fontSize: 14,
        color: "#777",
        fontFamily: fonts.bold,
    },

    value: {
        fontSize: 15,
        fontFamily: fonts.regular,
        color: "#222",
    },
});
