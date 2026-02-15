import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function CategoryIcon({ title, icon }: { title: string; icon: any }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 78 },
  iconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.darkBlue, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  icon: { width: 28, height: 28, tintColor: colors.cream },
  title: { color: colors.text, fontSize: 12 }
});
