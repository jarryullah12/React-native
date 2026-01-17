import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BottomNav = ({ activeTab, onHomePress, onShopPress, onCartPress, onProfilePress }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onHomePress}
      >
        <MaterialIcons 
          name="home" 
          size={26} 
          color={activeTab === 'home' ? '#135bec' : '#94a3b8'} 
        />
        <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onShopPress}
      >
        <MaterialIcons 
          name="grid-view" 
          size={26} 
          color={activeTab === 'shop' ? '#135bec' : '#94a3b8'} 
        />
        <Text style={[styles.navText, activeTab === 'shop' && styles.activeNavText]}>
          Shop
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onCartPress}
      >
        <MaterialIcons 
          name="shopping-cart" 
          size={26} 
          color={activeTab === 'cart' ? '#135bec' : '#94a3b8'} 
        />
        <Text style={[styles.navText, activeTab === 'cart' && styles.activeNavText]}>
          Cart
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={onProfilePress}
      >
        <MaterialIcons 
          name="person-outline" 
          size={26} 
          color={activeTab === 'profile' ? '#135bec' : '#94a3b8'} 
        />
        <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
  },
  activeNavText: {
    color: '#135bec',
    fontWeight: '700',
  },
});

export default BottomNav;
