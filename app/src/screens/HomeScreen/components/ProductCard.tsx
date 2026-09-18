import AppImage from "@/app/src/components/AppImage";
import { fonts } from "@/app/src/theme/fonts";
import { getBaseUrl } from "@/app/src/utils/common";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;
interface Props {
    item: any;
    onPress?: () => void;
}

const ProductCard = React.memo(function ProductCard({ item, onPress }: Props) {
    const getImageUrl = getBaseUrl() + 'images/imageSelectors/' + item.thumbnailSelector + '.jpg/THUMB'
    const startWeight = Number(item.productionRangeStart);
    const endWeight = Number(item.productionRangeEnd);
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={onPress}
        >
            <AppImage
                containerStyle={styles.image}
                uri={getImageUrl}
            />
            <View
                style={[
                    styles.stockBadge,
                    { backgroundColor: item.inStock ? "#0A7D4F" : "#8B0000" },
                ]}
            >
                <Text style={styles.stockText}>
                    {item.inStock ? "IN STOCK" : "OUT OF STOCK"}
                </Text>
            </View>

            <Text style={styles.name} numberOfLines={1}>
                {item.name}
            </Text>

            {/* <Text style={styles.brand} numberOfLines={1}>
                {item.name}
            </Text> */}

            <Text style={styles.price}>
                {Number.isFinite(startWeight) && Number.isFinite(endWeight)
                    ? `${startWeight.toFixed(1)} gm - ${endWeight.toFixed(1)} gm`
                    : "Weight unavailable"}
            </Text>
        </TouchableOpacity>
    );
});

export default ProductCard;


const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: "space-between",
        paddingHorizontal: 12,
    },
    card: {
        width: CARD_WIDTH,
        marginBottom: 16,
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 12,
    },
    name: {
        marginTop: 8,
        fontFamily: fonts.bold
    },
    brand: {
        fontSize: 12,
        color: "#666",
    },
    price: {
        marginTop: 4,
        fontFamily: fonts.regular
    },
    stockBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 16,
        opacity: 0.75,
    },
    stockText: {
        color: "#fff",
        fontSize: 8,
        fontWeight: "600",
    },
});