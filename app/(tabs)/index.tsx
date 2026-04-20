
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { allTools } from '@/data/tools';
import Footer from '@/components/footer';

const quickActions = [
  {
    title: 'Open Tools',
    subtitle: 'Run generators, validators, and utilities',
    icon: 'toolbox-outline',
    route: '/(tabs)/tools',
  },
  {
    title: 'Analyze Website',
    subtitle: 'Check titles, descriptions, links, and content',
    icon: 'magnify-scan',
    route: '/(tabs)/analyzer',
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const categories = new Set(allTools.map((tool) => tool.category));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>OptiSEO Workspace</Text>
          <Text style={styles.title}>Your tools and navigation are now organized in one clean workflow.</Text>
          <Text style={styles.subtitle}>
            Open tools, analyze websites, and view utility results without leaving the app.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.title}
            style={styles.actionCard}
            onPress={() => router.push(action.route as never)}
            activeOpacity={0.85}
          >
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name={action.icon as never} size={22} color="#6C5CE7" />
            </View>
            <View style={styles.actionBody}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>
            <Feather name="arrow-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{allTools.length}</Text>
            <Text style={styles.statLabel}>Working Tools</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{categories.size}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Categories</Text>
        </View>

        <View style={styles.categoryWrap}>
          {[...categories].map((category) => (
            <View key={category} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    padding: 20,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 22,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#312E81',
    color: '#E9D5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#D1D5DB',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EFE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionBody: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6C5CE7',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoryText: {
    color: '#374151',
    fontWeight: '600',
  },
});
