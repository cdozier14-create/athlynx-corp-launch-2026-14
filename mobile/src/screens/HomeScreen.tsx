import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  const features = [
    { icon: '🏈', title: 'Transfer Portal', screen: 'Portal' },
    { icon: '🧙', title: 'AI Wizards', screen: 'Wizards' },
    { icon: '💰', title: 'NIL Calculator', screen: 'Profile' },
    { icon: '📊', title: 'Analytics', screen: 'Profile' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>ATHLYNX</Text>
        <Text style={styles.heroSubtitle}>THE ATHLETE'S PLAYBOOK</Text>
        <Text style={styles.tagline}>Dreams Do Come True</Text>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>2,847</Text>
          <Text style={styles.statLabel}>Athletes</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>$4.2M</Text>
          <Text style={styles.statLabel}>NIL Deals</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>156</Text>
          <Text style={styles.statLabel}>Schools</Text>
        </View>
      </View>

      <Text style={styles.section}>Quick Access</Text>
      <View style={styles.grid}>
        {features.map((f, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => navigation.navigate(f.screen)}>
            <Text style={styles.cardIcon}>{f.icon}</Text>
            <Text style={styles.cardTitle}>{f.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>A Dozier Holdings Group Company</Text>
        <Text style={styles.footerText}>Pure Python & Julia Technology</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  hero: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#1e293b' },
  heroTitle: { fontSize: 36, fontWeight: 'bold', color: '#22d3ee' },
  heroSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  tagline: { fontSize: 16, color: '#fbbf24', marginTop: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#22d3ee' },
  statLabel: { fontSize: 12, color: '#64748b' },
  section: { fontSize: 18, fontWeight: 'bold', color: '#fff', padding: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  card: { width: '45%', backgroundColor: '#1e293b', borderRadius: 16, padding: 20, margin: '2.5%', alignItems: 'center' },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  footer: { alignItems: 'center', paddingVertical: 30 },
  footerText: { color: '#64748b', fontSize: 12 },
});
