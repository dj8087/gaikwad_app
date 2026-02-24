import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import AppImage from "./AppImage";

const { width } = Dimensions.get("screen");

interface CarouselItem {
  id: string | number;
  image?: any;
  url?: string;
}

interface Props {
  data: CarouselItem[];
  autoScroll?: boolean;
  interval?: number;
  style?: ViewStyle;
}

export default function Carousel({
  data,
  autoScroll = false,
  interval = 2000,
  style,
}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!autoScroll) return;

    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= data.length) nextIndex = 0;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, interval);

    return () => clearInterval(timer);
  }, [activeIndex, autoScroll]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / width
    );
    setActiveIndex(index);
  };

  const carouselHeight = style?.height || 200;

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          if (item.url) {
            return (
              <AppImage
                uri={item.url}
                containerStyle={styles.image}
                height={carouselHeight}
              />
            );
          }
          return null;
        }}
      />

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                opacity: i === activeIndex ? 1 : 0.3,
                width: i === activeIndex ? 12 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" , paddingLeft:20,paddingRight:20 },
  image: {
    width: width,
    resizeMode: "cover",
    backgroundColor: "#eee",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6A00",
    marginHorizontal: 4,
  },
});
