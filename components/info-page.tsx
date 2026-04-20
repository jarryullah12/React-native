import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Footer from './footer';

type Section = {
  title: string;
  paragraphs: string[];
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: Section[];
};

export default function InfoPage({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
}: InfoPageProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.intro}>{intro}</Text>
        <Text style={styles.updated}>Last updated: {lastUpdated}</Text>
      </View>

      {sections.map((section) => (
        <View key={section.title} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.paragraphs.map((paragraph, index) => (
            <Text key={`${section.title}-${index}`} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>
      ))}
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 22,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C4B5FD',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  intro: {
    fontSize: 14,
    lineHeight: 21,
    color: '#E5E7EB',
    marginBottom: 12,
  },
  updated: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 10,
  },
});
