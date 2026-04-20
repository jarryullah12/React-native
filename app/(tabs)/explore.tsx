import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  
  // Data array for Recent Analyses cards
  const recentAnalyses =[
    {
      id: 1,
      domain: 'techcrunch.com',
      time: 'Analyzed 2 hrs ago',
      score: 84,
      icon: 'globe',
      iconBg: '#EFE9FE',
      iconColor: '#6C5CE7',
      tags:[
        { id: 1, icon: 'arrow-up', color: '#10B981', text: 'Performance' },
        { id: 2, icon: 'alert-triangle', color: '#EF4444', text: '2 Issues' }
      ]
    },
    {
      id: 2,
      domain: 'nike.com',
      time: 'Analyzed yesterday',
      score: 92,
      icon: 'shopping-cart',
      iconBg: '#EFE9FE',
      iconColor: '#6C5CE7',
      // Background decoration shape inside the card
      hasDecoration: true, 
      tags:[
        { id: 1, icon: 'check-circle', color: '#10B981', text: 'Mobile Friendly' }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Feather name="menu" size={24} color="#6C5CE7" />
        </TouchableOpacity>
        <Text style={styles.logoText}>OptiSEO</Text>
        <TouchableOpacity>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* --- HERO SECTION --- */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Analyze Any URL.</Text>
          <Text style={styles.heroTitlePurple}>Unlock Deep Insights.</Text>
          <Text style={styles.heroDesc}>
            Discover critical SEO metrics, performance bottlenecks, and actionable intelligence to dominate search rankings.
          </Text>
        </View>

        {/* --- URL INPUT BAR --- */}
        <View style={styles.inputCard}>
          <Feather name="link" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter website URL (e.g., example..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* --- RECENT ANALYSES HEADER --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Analyses</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {/* --- RECENT ANALYSES LIST --- */}
        <View style={styles.listContainer}>
          {recentAnalyses.map((item) => (
            <View key={item.id} style={styles.card}>
              
              {/* Optional Decoration for Nike card */}
              {item.hasDecoration && <View style={styles.cardDecoration} />}

              <View style={styles.cardTopRow}>
                <View style={[styles.cardIconBox, { backgroundColor: item.iconBg }]}>
                  <Feather name={item.icon} size={20} color={item.iconColor} />
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>SCORE: {item.score}</Text>
                </View>
              </View>

              <Text style={styles.domainText}>{item.domain}</Text>
              <Text style={styles.timeText}>{item.time}</Text>

              <View style={styles.tagsContainer}>
                {item.tags.map((tag) => (
                  <View key={tag.id} style={styles.tag}>
                    <Feather name={tag.icon} size={14} color={tag.color} />
                    <Text style={[styles.tagText, { color: '#374151' }]}>
                      {tag.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* --- ANALYZE COMPETITOR (DASHED CARD) --- */}
          <TouchableOpacity style={styles.dashedCard}>
            <View style={styles.plusIconBox}>
              <Feather name="plus" size={20} color="#6B7280" />
            </View>
            <Text style={styles.dashedTitle}>Analyze Competitor</Text>
            <Text style={styles.dashedDesc}>Compare your site against industry leaders.</Text>
          </TouchableOpacity>

        </View>

        {/* Bottom Padding for Scroll */}
        <View style={{ height: 120 }} /> 
      </ScrollView>

      {/* --- BOTTOM NAVIGATION --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="grid" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>DASHBOARD</Text>
        </TouchableOpacity>
        
        {/* Active Item: Analyzer */}
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialCommunityIcons name="magnify-chart" size={26} color="#FFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="star-four-points" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>INSIGHTS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Feather name="settings" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>SETTINGS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F9FB',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
    letterSpacing: 0.5,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  heroTitlePurple: {
    fontSize: 32,
    fontWeight: '800',
    color: '#6C5CE7',
    textAlign: 'center',
    marginBottom: 15,
  },
  heroDesc: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 35,
    borderRadius: 30, // Pill shape
    paddingHorizontal: 20,
    height: 60,
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6C5CE7',
    letterSpacing: 0.5,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    overflow: 'hidden', // For the absolute decoration
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDecoration: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF5EB', // Light subtle orange/yellow decoration
    opacity: 0.6,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  cardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  domainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 5,
  },
  tagText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  dashedCard: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  plusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  dashedDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F9FB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 25, 
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemActive: {
    backgroundColor: '#825EE4',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30, // Elevated floating effect
    shadowColor: '#825EE4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  navText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 6,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
