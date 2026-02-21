import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import SeeAllHeader from "@/app/src/components/SeeAllHeader";
import { fonts } from "@/app/src/theme/fonts";
import colors from "@/app/src/theme/colors";
import { useAuthData } from "@/app/src/hooks/useAuthData";
import { getBaseUrl } from "@/app/src/utils/common";

interface Category {
    id: number;
    name: string;
    nameMr: string;
    iconSelector: string;
}

interface Props {
    categories: Category[];
    onCategoryPress?: (item: Category) => void;
}

export default function CategoryList({
    categories,
    onCategoryPress,
}: Props) {
    const { token } = useAuthData()

    const renderItem = ({ item }: { item: Category }) => {
        const getImageUrl = getBaseUrl() + 'images/iconSelectors/' + item.iconSelector
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                activeOpacity={0.7}
                onPress={() => onCategoryPress?.(item)}
            >
                <View style={styles.imageWrapper}>
                    <Image
                        source={{
                            uri: getImageUrl,
                            headers: { token },
                        }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                <Text style={styles.title} numberOfLines={1}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ marginTop: 10 }}>
            <SeeAllHeader title="Category" onPress={() => { }} />

            <FlatList
                horizontal
                data={categories}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        alignItems: "center",
        marginHorizontal: 12,
    },
    imageWrapper: {
        width: 80,
        height: 80,
        borderRadius: 60,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    title: {
        fontFamily: fonts.medium,
        fontSize: 12,
        textAlign: "center",
        maxWidth: 70,
    },
});