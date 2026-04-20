
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { checkServerStatus, estimateDomainAuthority, type DomainAuthorityReport, type ServerStatusReport } from '@/lib/tool-utils';

type AnalyzerResult = {
  authority: DomainAuthorityReport;
  server: ServerStatusReport;
};

function getScoreColor(score: number) {
  if (score >= 85) return '#10B981';
  if (score >= 70) return '#3B82F6';
  if (score >= 55) return '#F59E0B';
  return '#EF4444';
}

export default function AnalyzerScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzerResult | null>(null);
  const scoreColor = useMemo(
    () => getScoreColor(analysis?.authority.score ?? 0),
    [analysis?.authority.score]
  );

  const handleAnalyze = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const [authority, server] = await Promise.all([
        estimateDomainAuthority(trimmedUrl),
        checkServerStatus(trimmedUrl),
      ]);

      setAnalysis({ authority, server });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to analyze website. Please check the URL and your internet connection.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Advanced Website Analyzer</Text>
        <Text style={styles.heroSubtitle}>
          Enter a URL to review SEO score, health checks, metadata, links, response time, and missing signals in one place.
        </Text>
      </View>

      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Enter website URL"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={styles.button} onPress={handleAnalyze} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Analyze</Text>}
        </TouchableOpacity>
      </View>

      {analysis && (
        <>
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View>
                <Text style={styles.scoreLabel}>SEO Health Score</Text>
                <Text style={styles.scoreUrl}>{analysis.authority.report.finalUrl}</Text>
              </View>
              <Text style={[styles.scoreValue, { color: scoreColor }]}>
                {analysis.authority.score}
              </Text>
            </View>

            <View style={styles.scoreBarTrack}>
              <View
                style={[
                  styles.scoreBarFill,
                  { width: `${analysis.authority.score}%`, backgroundColor: scoreColor },
                ]}
              />
            </View>

            <Text style={[styles.gradeBadge, { color: scoreColor }]}>
              Grade: {analysis.authority.grade}
            </Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{analysis.server.responseTimeMs} ms</Text>
              <Text style={styles.metricLabel}>Response Time</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{analysis.server.statusCode}</Text>
              <Text style={styles.metricLabel}>HTTP Status</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{analysis.authority.report.wordCount}</Text>
              <Text style={styles.metricLabel}>Words</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{analysis.authority.report.internalLinks}</Text>
              <Text style={styles.metricLabel}>Internal Links</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{analysis.authority.report.externalLinks}</Text>
              <Text style={styles.metricLabel}>External Links</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Core SEO Signals</Text>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Title</Text>
              <Text style={styles.resultValue}>{analysis.authority.report.title}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Description</Text>
              <Text style={styles.resultValue}>{analysis.authority.report.description}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Canonical</Text>
              <Text style={styles.resultValue}>{analysis.authority.report.canonical}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>H1</Text>
              <Text style={styles.resultValue}>{analysis.authority.report.h1}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Robots</Text>
              <Text style={styles.resultValue}>{analysis.authority.report.robots}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What Is Working</Text>
            {analysis.authority.reasons.map((reason) => (
              <Text key={reason} style={styles.listItem}>
                - {reason}
              </Text>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Issues To Fix</Text>
            {analysis.authority.report.missing.length ? (
              analysis.authority.report.missing.map((item) => (
                <Text key={item} style={styles.issueItem}>
                  - {item}
                </Text>
              ))
            ) : (
              <Text style={styles.goodText}>No major missing SEO signals found.</Text>
            )}
          </View>
        </>
      )}
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
    paddingBottom: 28,
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#D1D5DB',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  scoreUrl: {
    fontSize: 13,
    color: '#374151',
    maxWidth: 220,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: '800',
  },
  scoreBarTrack: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 12,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  gradeBadge: {
    fontSize: 15,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  listItem: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },
  issueItem: {
    fontSize: 14,
    color: '#B91C1C',
    marginBottom: 8,
    lineHeight: 20,
  },
  goodText: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '600',
  },
});
