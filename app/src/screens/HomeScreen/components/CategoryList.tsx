import assets from "@/app/src/assets";
import SeeAllHeader from "@/app/src/components/SeeAllHeader";
import { fonts } from "@/app/src/theme/fonts";
import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const data = [
    { title: "Rings", image: assets.images.ring },
    { title: "Necklace", image: assets.images.ring },
    { title: "Bracelets", image: assets.images.ring },
    { title: "Earrings", image: assets.images.ring },
    { title: "Nose rings", image: assets.images.ring },
    { title: "Necklace ", image: assets.images.ring },
    { title: "Bracelets ", image: assets.images.ring },
    { title: "Earrings ", image: assets.images.ring },
];

export default function CategoryList() {
    return (
        <View>
            <SeeAllHeader title="Category" onPress={() => { }} />
            <FlatList
                horizontal
                data={data}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={{ alignItems: 'center', marginHorizontal: 15, marginTop:20 }}>
                        <Image source={item.image} style={{ width: 40, height: 40 }} />
                        <Text style={{ fontFamily: fonts.regular, textAlign: "center" }}>{item.title}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.title}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        paddingHorizontal: 18,
    },
    title: {
        fontFamily: fonts.bold,
        fontSize: 18,
    },
});
