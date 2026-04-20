import { Feather } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const menuSections = [
  {
    title: 'Main',
    links: [
      { label: 'Dashboard', route: '/(tabs)' },
      { label: 'Tools', route: '/(tabs)/tools' },
      { label: 'Analyzer', route: '/(tabs)/analyzer' },
      { label: 'More tools', route: 'https://getoptiseo.com/tools' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'Privacy Policy', route: '/(tabs)/privacy-policy' },
      { label: 'App Info', route: '/(tabs)/app-info' },
      { label: 'Contact Us', route: '/(tabs)/contact-us' },
      { label: 'Terms & Conditions', route: '/(tabs)/terms-and-conditions' },
      { label: 'Disclaimer', route: '/(tabs)/disclaimer' },
    ],
  },
];

function HeaderMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <View style={styles.menuAnchor}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setOpen((current) => !current)}
        activeOpacity={0.85}
      >
        <Feather name={open ? 'x' : 'menu'} size={22} color="#111827" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View />
        </Pressable>

        <View style={styles.modalPositioner} pointerEvents="box-none">
          <View style={styles.menuDropdown}>
            {menuSections.map((section) => (
              <View key={section.title} style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>{section.title}</Text>
                {section.links.map((item) => {
                  const isActive =
                    item.route === '/(tabs)'
                      ? pathname === '/(tabs)' || pathname === '/'
                      : pathname === item.route;

                  return (
                    <TouchableOpacity
                      key={item.route}
                      style={[styles.menuItem, isActive && styles.menuItemActive]}
                      onPress={() => {
                        setOpen(false);
                        if (item.route.startsWith('http')) {
                          Linking.openURL(item.route);
                        } else {
                          router.push(item.route as never);
                        }
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: '#111827',
        headerStyle: {
          backgroundColor: '#F8F9FB',
        },
        headerTitleAlign: 'left',
        headerTitle: ({ children }) => (
          <View style={styles.breadcrumbWrap}>
            <Text style={styles.brandText}>OptiSEO</Text>
            <Text style={styles.separator}>/</Text>
            <Text style={styles.pageText}>{children}</Text>
          </View>
        ),
        headerRight: () => <HeaderMenu />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="tools"
        options={{
          title: 'Tools',
        }}
      />
      <Stack.Screen
        name="analyzer"
        options={{
          title: 'Analyzer',
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          title: 'Privacy Policy',
        }}
      />
      <Stack.Screen
        name="app-info"
        options={{
          title: 'App Info',
        }}
      />
      <Stack.Screen
        name="contact-us"
        options={{
          title: 'Contact Us',
        }}
      />
      <Stack.Screen
        name="terms-and-conditions"
        options={{
          title: 'Terms & Conditions',
        }}
      />
      <Stack.Screen
        name="disclaimer"
        options={{
          title: 'Disclaimer',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  breadcrumbWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  separator: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  pageText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  menuAnchor: {
    marginRight: 4,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 24, 39, 0.14)',
  },
  modalPositioner: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: 16,
  },
  menuDropdown: {
    width: 244,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },
  menuSection: {
    paddingVertical: 4,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 6,
  },
  menuItem: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  menuItemActive: {
    backgroundColor: '#EFE9FE',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  menuItemTextActive: {
    color: '#6C5CE7',
  },
});
