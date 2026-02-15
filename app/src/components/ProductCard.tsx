import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';

type Props = {
  item: any;
  onPress?: () => void;
};

export default function ProductCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* <Image source={ item.productImage ? { uri: item.productImage } : require('../../assets/images/placeholder.png') } style={styles.image} /> */}
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.name}>{item.productName}</Text>
        <Text style={styles.price}>₹ {item.price ?? '—'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    width: 160,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2
  },
  image: { width: '100%', height: 120, borderRadius: 8, backgroundColor: '#f2f2f2' },
  body: { marginTop: 8 },
  name: { color: colors.text, fontWeight: '600' },
  price: { color: colors.roseGold, marginTop: 4 }
});
