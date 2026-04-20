import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
  const handleLink = () => {
    Linking.openURL('https://www.getoptiseo.com');
  };

  return (
    <View style={styles.footer}>
      <Text style={styles.text}>Brought to you by </Text>
      <TouchableOpacity onPress={handleLink}>
        <Text style={styles.link}>www.getoptiseo.com</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 16,
  },
  text: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  link: {
    fontSize: 13,
    color: '#6C5CE7',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
