import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SeeAllHeader from "@/app/src/components/SeeAllHeader";
import { fonts } from "@/app/src/theme/fonts";
import colors from "@/app/src/theme/colors";
import { useAuthData } from "@/app/src/hooks/useAuthData";
import { getBaseUrl } from "@/app/src/utils/common";
import useAppNavigation from "@/app/src/hooks/useAppNavigation";

interface Category {
    id: number;
    name: string;
    nameMr: string;
    iconSelector: string;
}

interface Props {
    categories: Category[];
    onCategoryPress?: (item: Category) => void;
    activeCategoryId?: number | null;
}

export default function CategoryList({
    categories,
    onCategoryPress,
    activeCategoryId,
}: Props) {
    const { token } = useAuthData()
    const flatListRef = React.useRef<FlatList>(null);
    const navigation = useAppNavigation();

    const sortedCategories = React.useMemo(() => {
        if (activeCategoryId == null || !categories) return categories;
        const activeIndex = categories.findIndex((c) => c.id === activeCategoryId);
        if (activeIndex > 0) {
            const arr = [...categories];
            const [active] = arr.splice(activeIndex, 1);
            arr.unshift(active);
            return arr;
        }
        return categories;
    }, [categories, activeCategoryId]);

    const renderItem = ({ item }: { item: Category }) => {
        const getImageUrl = getBaseUrl() + 'images/iconSelectors/' + item.iconSelector
        const isActive = item.id === activeCategoryId;
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                activeOpacity={0.7}
                onPress={() => {
                    onCategoryPress?.(item);
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                }}
            >
                <View style={[styles.imageWrapper, isActive && styles.activeImageWrapper]}>
                    <Image
                        source={{
                            uri: getImageUrl,
                            headers: { token },
                        }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    {isActive && (
                        <View style={styles.tickContainer}>
                            <Ionicons name="checkmark-circle" size={24} color="#4BB543" />
                        </View>
                    )}
                </View>

                <Text style={[styles.title, isActive && styles.activeTitle]} numberOfLines={1}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ marginTop: 10 }}>
            <SeeAllHeader title="Category" showSeeAll={false} onPress={() => navigation.navigate("ProductFilter" as never)} />

            <FlatList
                ref={flatListRef}
                horizontal
                data={sortedCategories}
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
    activeImageWrapper: {
        borderWidth: 3,
        borderColor: colors.darkBlue,
    },
    activeTitle: {
        color: colors.darkBlue,
        fontFamily: fonts.bold,
    },
    tickContainer: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: colors.white,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
});