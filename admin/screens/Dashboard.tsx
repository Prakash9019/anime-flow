// screens/Dashboard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminHeader from '../components/AdminHeader';
import { COLORS, FONTS } from '../../theme';

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader title="Dashboard" />
      
      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>AMEED</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminText}>ADMIN</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>User Logins</Text>
            <Text style={styles.statValue}>1000</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ratings Submitted</Text>
            <Text style={styles.statValue}>10.3K</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>User Downloads</Text>
            <Text style={styles.statValue}>25K</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>ANIME FLOW ADMIN MODE</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginTop: 40,
    marginBottom: 40,
  },
  welcomeText: {
    color: COLORS.text,
    fontSize: 32,
    fontFamily: FONTS.title,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userName: {
    color: COLORS.cyan,
    fontSize: 32,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  adminBadge: {
    backgroundColor: COLORS.cyan,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adminText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    gap: 20,
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
  },
  statLabel: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 8,
  },
  statValue: {
    color: COLORS.cyan,
    fontSize: 48,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerLine: {
    width: 80,
    height: 4,
    backgroundColor: COLORS.cyan,
    marginBottom: 12,
  },
  footerText: {
    color: COLORS.cyan,
    fontSize: 14,
    fontFamily: FONTS.title,
  },
});
