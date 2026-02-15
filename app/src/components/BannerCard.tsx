import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';

export default function BannerCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.card}>
      {/* <Image source={require('../../assets/images/placeholder.png')} style={styles.img} /> */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>SHOP NOW</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: 12, marginVertical: 12 },
  img: { width: 88, height: 88, borderRadius: 8, backgroundColor: '#eee' },
  content: { marginLeft: 12, flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: colors.darkBlue },
  subtitle: { color: colors.muted, marginTop: 4 },
  btn: { marginTop: 8, backgroundColor: colors.roseGold, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  btnText: { color: 'white', fontWeight: '700' }
});
