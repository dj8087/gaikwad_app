import SeeAllHeader from "@/app/src/components/SeeAllHeader";
import colors from "@/app/src/theme/colors";
import { fonts } from "@/app/src/theme/fonts";
import React from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    View
} from "react-native";
import ProductCard from "./ProductCard";

interface Product {
    id: number;
    name: string;
    nameM?: string;
    productionRangeStart: any;
    productionRangeEnd: any;
    inStock: boolean;
    thumbnailSelector: string;
    categoryId: number;
    subCategoryId: number;
}

interface Props {
    title: string;
    data: Product[];
    onSeeAll?: () => void;
    onProductPress?: (item: Product) => void;
}

const { width } = Dimensions.get("screen");
const CARD_WIDTH = (width - 18 * 2 - 16) / 2;

export default function ProductSection({
    title,
    data,
    onSeeAll,
    onProductPress,
}: Props) {

    const renderItem = ({ item }: any) => (
        <ProductCard
            item={item}
            onPress={() => onProductPress?.(item)}
        />
    );

    return (
        <View style={{ marginTop: 20 }}>
            <SeeAllHeader title={title} onPress={onSeeAll} />
            <FlatList
                data={data}
                renderItem={renderItem}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.container}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={5}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: "space-between",
        marginBottom: 18,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 18,
    },
    title: {
        fontFamily: fonts.bold,
        fontSize: 18,
    },
    link: {
        fontFamily: fonts.medium,
        fontSize: 14,
        color: colors.primary,
    },
    card: {
        backgroundColor: colors.cream,
        borderRadius: 16,
        padding: 14,
    },
    image: {
        width: "100%",
        height: 80,
        borderRadius: 14,
        resizeMode: "cover",
    },
    heartBtn: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "#ffffffcc",
        borderRadius: 20,
        padding: 6,
    },
    name: {
        fontFamily: fonts.bold,
        marginTop: 10,
    },
    brand: {
        fontFamily: fonts.regular,
        fontSize: 12,
        color: "#777",
    },
    price: {
        fontFamily: fonts.semi,
        marginTop: 6,
    },
});
