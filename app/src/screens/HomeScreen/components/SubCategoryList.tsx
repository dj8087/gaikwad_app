import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "@/app/src/theme/colors";
import { fonts } from "@/app/src/theme/fonts";

interface SubCategory {
    id: number;
    name: string;
}

interface Props {
    subCategories: SubCategory[];
    onSubCategoryPress?: (item: SubCategory | null) => void;
    activeSubCategoryId?: number | null;
}

export default function SubCategoryList({
    subCategories,
    onSubCategoryPress,
    activeSubCategoryId,
}: Props) {
    if (!subCategories || subCategories.length === 0) {
        return null;
    }

    const data = [{ id: 'all', name: 'All' }, ...subCategories];

    const renderItem = ({ item }: { item: any }) => {
        const isAll = item.id === 'all';
        const isActive = isAll ? activeSubCategoryId === null : item.id === activeSubCategoryId;

        return (
            <TouchableOpacity
                style={[styles.itemContainer, isActive && styles.activeItemContainer]}
                activeOpacity={0.7}
                onPress={() => onSubCategoryPress?.(isAll ? null : item)}
            >
                <Text style={[styles.title, isActive && styles.activeTitle]} numberOfLines={1}>
                    {item.name || item}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                data={data}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 10, marginBottom: 5 },
    listContainer: { paddingHorizontal: 15, gap: 10 },
    itemContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    activeItemContainer: { backgroundColor: colors.darkBlue },
    title: { fontFamily: fonts.medium, fontSize: 14, color: "#333" },
    activeTitle: { color: colors.white, fontFamily: fonts.bold },
});