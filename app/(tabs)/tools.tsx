import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { allTools, toolCategories } from '@/data/tools';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 25; // 2 columns with padding

export default function ToolsScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All Tools');
  const [searchQuery, setSearchQuery] = useState('');

  // Search + category filter
  const filteredTools = allTools.filter((tool) => {
    const isCategoryMatch =
      activeCategory === 'All Tools' || tool.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const isQueryMatch =
      query.length === 0 ||
      tool.title.toLowerCase().includes(query) ||
      tool.desc.toLowerCase().includes(query);

    return isCategoryMatch && isQueryMatch;
  });

  // Render individual tool card (2-Column format)
  const renderToolCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/tool/${item.slug}`)}
      activeOpacity={0.85}
    >
      <View style={styles.iconContainer}>
        <Feather name={item.icon as never} size={20} color="#6C5CE7" />
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- MAIN CONTENT (FLATLIST) --- */}
      <FlatList
        data={filteredTools}
        keyExtractor={(item) => item.id}
        renderItem={renderToolCard}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.rowWrapper}
        ListHeaderComponent={
          <>
            {/* SEARCH BAR */}
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search hundreds of tools..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* CATEGORIES SCROLL */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={toolCategories}
              keyExtractor={(item) => item}
              style={styles.categoryScroll}
              contentContainerStyle={{ paddingRight: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    activeCategory === item && styles.categoryChipActive
                  ]}
                  onPress={() => setActiveCategory(item)}
                >
                  <Text style={[
                    styles.categoryText,
                    activeCategory === item && styles.categoryTextActive
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{activeCategory}</Text>
              <Text style={styles.resultCount}>{filteredTools.length} tools</Text>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 10,
  },
  categoryScroll: {
    marginTop: 20,
    marginBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#6C5CE7',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  resultCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 3,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
});
