// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import AdminHeader from '../components/AdminHeader';
// import { COLORS, FONTS } from '../../theme';
// import ApiService from '../../services/api';
// import { useAuth } from '../../hooks/useAuth';

// interface DashboardStats {
//   userLogins: number;
//   ratingsSubmitted: number;
//   userDownloads: number;
//   totalAnime: number;
//   totalEpisodes: number;
// }

// export default function Dashboard(): React.ReactElement {
//   const { user } = useAuth();
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [syncing, setSyncing] = useState(false);
//   const [syncingEpisodes, setSyncingEpisodes] = useState(false);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await fetch(`${ApiService.baseURL}/admin/stats`, {
//         headers: await ApiService.getAuthHeaders(),
//       });
//       const data = await response.json();
//       setStats(data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSyncMAL = async () => {
//     Alert.alert(
//       'Sync with MyAnimeList',
//       'This will fetch anime AND episodes from MAL. This process may take several minutes.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Sync All', 
//           onPress: async () => {
//             setSyncing(true);
//             try {
//               const response = await fetch(`${ApiService.baseURL}/anime/sync-mal`, {
//                 method: 'POST',
//                 headers: await ApiService.getAuthHeaders(),
//               });
//               const result = await response.json();
//               Alert.alert('Success', result.message);
//               // Refresh stats after sync
//               await fetchStats();
//             } catch (error) {
//               Alert.alert('Error', 'Failed to sync with MAL');
//             } finally {
//               setSyncing(false);
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleSyncEpisodesOnly = async () => {
//     Alert.alert(
//       'Sync Episodes Only',
//       'This will add episodes to existing anime without episodes. May take several minutes.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Sync Episodes', 
//           onPress: async () => {
//             setSyncingEpisodes(true);
//             try {
//               const response = await fetch(`${ApiService.baseURL}/anime/sync-episodes`, {
//                 method: 'POST',
//                 headers: await ApiService.getAuthHeaders(),
//               });
//               const result = await response.json();
//               Alert.alert('Success', result.message);
//               await fetchStats();
//             } catch (error) {
//               Alert.alert('Error', 'Failed to sync episodes');
//             } finally {
//               setSyncingEpisodes(false);
//             }
//           }
//         }
//       ]
//     );
//   };

//   const formatNumber = (num: number): string => {
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <AdminHeader title="Dashboard" />

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Welcome Section */}
//         <View style={styles.welcomeSection}>
//           <Text style={styles.welcomeText}>Welcome Back,</Text>
//           <View style={styles.nameRow}>
//             <Text style={styles.userName}>
//               {user?.name?.toUpperCase() || 'ADMIN'}
//             </Text>
//             <View style={styles.adminBadge}>
//               <Text style={styles.adminText}>ADMIN</Text>
//             </View>
//           </View>
//           <Text style={styles.lastLogin}>
//             Last login: {new Date().toLocaleDateString()}
//           </Text>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActionsSection}>
//           <Text style={styles.sectionTitle}>Quick Actions</Text>
//           <View style={styles.actionButtonsRow}>
//             <TouchableOpacity 
//               style={[styles.actionButton, { opacity: syncing ? 0.6 : 1 }]}
//               onPress={handleSyncMAL}
//               disabled={syncing || syncingEpisodes}
//             >
//               {syncing ? (
//                 <ActivityIndicator color={COLORS.black} size="small" />
//               ) : (
//                 <Ionicons name="refresh" color={COLORS.black} size={20} />
//               )}
//               <Text style={styles.actionButtonText}>
//                 {syncing ? 'Syncing...' : 'Sync MAL'}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={[styles.actionButton, { opacity: syncingEpisodes ? 0.6 : 1 }]}
//               onPress={handleSyncEpisodesOnly}
//               disabled={syncing || syncingEpisodes}
//             >
//               {syncingEpisodes ? (
//                 <ActivityIndicator color={COLORS.black} size="small" />
//               ) : (
//                 <Ionicons name="play-circle" color={COLORS.black} size={20} />
//               )}
//               <Text style={styles.actionButtonText}>
//                 {syncingEpisodes ? 'Syncing...' : 'Sync Episodes'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Statistics */}
//         <View style={styles.statsSection}>
//           <Text style={styles.sectionTitle}>Platform Statistics</Text>
//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator color={COLORS.cyan} size="large" />
//               <Text style={styles.loadingText}>Loading statistics...</Text>
//             </View>
//           ) : (
//             <View style={styles.statsContainer}>
//               <View style={styles.statCard}>
//                 <View style={styles.statIconContainer}>
//                   <Ionicons name="people" color={COLORS.cyan} size={24} />
//                 </View>
//                 <Text style={styles.statLabel}>User Logins</Text>
//                 <Text style={styles.statValue}>
//                   {formatNumber(stats?.userLogins || 0)}
//                 </Text>
//               </View>

//               <View style={styles.statCard}>
//                 <View style={styles.statIconContainer}>
//                   <Ionicons name="star" color={COLORS.cyan} size={24} />
//                 </View>
//                 <Text style={styles.statLabel}>Ratings Submitted</Text>
//                 <Text style={styles.statValue}>
//                   {formatNumber(stats?.ratingsSubmitted || 0)}
//                 </Text>
//               </View>

//               <View style={styles.statCard}>
//                 <View style={styles.statIconContainer}>
//                   <Ionicons name="download" color={COLORS.cyan} size={24} />
//                 </View>
//                 <Text style={styles.statLabel}>User Downloads</Text>
//                 <Text style={styles.statValue}>
//                   {formatNumber(stats?.userDownloads || 0)}
//                 </Text>
//               </View>

//               <View style={styles.statCard}>
//                 <View style={styles.statIconContainer}>
//                   <Ionicons name="film" color={COLORS.cyan} size={24} />
//                 </View>
//                 <Text style={styles.statLabel}>Total Anime</Text>
//                 <Text style={styles.statValue}>
//                   {formatNumber(stats?.totalAnime || 0)}
//                 </Text>
//               </View>

//               <View style={styles.statCard}>
//                 <View style={styles.statIconContainer}>
//                   <Ionicons name="play-circle" color={COLORS.cyan} size={24} />
//                 </View>
//                 <Text style={styles.statLabel}>Total Episodes</Text>
//                 <Text style={styles.statValue}>
//                   {formatNumber(stats?.totalEpisodes || 0)}
//                 </Text>
//               </View>

//               <View style={styles.statCard}>
//                 <View style={styles.statIconContainer}>
//                   <Ionicons name="trending-up" color={COLORS.cyan} size={24} />
//                 </View>
//                 <Text style={styles.statLabel}>Avg Rating</Text>
//                 <Text style={styles.statValue}>8.5</Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* System Status */}
//         <View style={styles.statusSection}>
//           <Text style={styles.sectionTitle}>System Status</Text>
//           <View style={styles.statusContainer}>
//             <View style={styles.statusItem}>
//               <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
//               <Text style={styles.statusText}>API Services</Text>
//               <Text style={styles.statusValue}>Online</Text>
//             </View>
            
//             <View style={styles.statusItem}>
//               <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
//               <Text style={styles.statusText}>Database</Text>
//               <Text style={styles.statusValue}>Connected</Text>
//             </View>
            
//             <View style={styles.statusItem}>
//               <View style={[styles.statusDot, { backgroundColor: '#FF9800' }]} />
//               <Text style={styles.statusText}>MAL API</Text>
//               <Text style={styles.statusValue}>Rate Limited</Text>
//             </View>
//           </View>
//         </View>

//         {/* Recent Activity */}
//         <View style={styles.activitySection}>
//           <Text style={styles.sectionTitle}>Recent Activity</Text>
//           <View style={styles.activityContainer}>
//             <View style={styles.activityItem}>
//               <Ionicons name="add-circle" color={COLORS.cyan} size={20} />
//               <View style={styles.activityInfo}>
//                 <Text style={styles.activityText}>New anime synced from MAL</Text>
//                 <Text style={styles.activityTime}>2 hours ago</Text>
//               </View>
//             </View>
            
//             <View style={styles.activityItem}>
//               <Ionicons name="star" color={COLORS.cyan} size={20} />
//               <View style={styles.activityInfo}>
//                 <Text style={styles.activityText}>50 new ratings submitted</Text>
//                 <Text style={styles.activityTime}>5 hours ago</Text>
//               </View>
//             </View>
            
//             <View style={styles.activityItem}>
//               <Ionicons name="people" color={COLORS.cyan} size={20} />
//               <View style={styles.activityInfo}>
//                 <Text style={styles.activityText}>15 new users registered</Text>
//                 <Text style={styles.activityTime}>1 day ago</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <View style={styles.footerLine} />
//         <Text style={styles.footerText}>ANIME FLOW ADMIN MODE</Text>
//         <Text style={styles.footerVersion}>v1.0.0</Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.black,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   welcomeSection: {
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   welcomeText: {
//     color: COLORS.text,
//     fontSize: 28,
//     fontFamily: FONTS.title,
//   },
//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//     marginBottom: 8,
//   },
//   userName: {
//     color: COLORS.cyan,
//     fontSize: 32,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//     marginRight: 12,
//   },
//   adminBadge: {
//     backgroundColor: COLORS.cyan,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   adminText: {
//     color: COLORS.black,
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   lastLogin: {
//     color: '#666',
//     fontSize: 14,
//     fontFamily: FONTS.body,
//   },
//   quickActionsSection: {
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     color: COLORS.text,
//     fontSize: 20,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   actionButtonsRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//     backgroundColor: COLORS.cyan,
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   actionButtonText: {
//     color: COLORS.black,
//     fontSize: 16,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//   },
//   statsSection: {
//     marginBottom: 30,
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   loadingText: {
//     color: '#666',
//     marginTop: 12,
//     fontSize: 14,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   statCard: {
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     padding: 16,
//     width: '48%',
//     alignItems: 'center',
//   },
//   statIconContainer: {
//     marginBottom: 8,
//   },
//   statLabel: {
//     color: COLORS.text,
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   statValue: {
//     color: COLORS.cyan,
//     fontSize: 24,
//     fontFamily: FONTS.title,
//     fontWeight: 'bold',
//   },
//   statusSection: {
//     marginBottom: 30,
//   },
//   statusContainer: {
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     padding: 16,
//   },
//   statusItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 12,
//   },
//   statusText: {
//     color: COLORS.text,
//     fontSize: 16,
//     flex: 1,
//   },
//   statusValue: {
//     color: '#666',
//     fontSize: 14,
//   },
//   activitySection: {
//     marginBottom: 30,
//   },
//   activityContainer: {
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     padding: 16,
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   activityInfo: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   activityText: {
//     color: COLORS.text,
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   activityTime: {
//     color: '#666',
//     fontSize: 12,
//   },
//   footer: {
//     alignItems: 'center',
//     paddingVertical: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#333',
//   },
//   footerLine: {
//     width: 80,
//     height: 4,
//     backgroundColor: COLORS.cyan,
//     marginBottom: 8,
//   },
//   footerText: {
//     color: COLORS.cyan,
//     fontSize: 14,
//     fontFamily: FONTS.title,
//     marginBottom: 4,
//   },
//   footerVersion: {
//     color: '#666',
//     fontSize: 12,
//   },
// });



// admin/screens/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../theme';
import ApiService from '../../services/api';

interface DashboardStats {
  userLogins: number;
  ratingsSubmitted: number;
  userDownloads: number;
  totalAnime: number;
  totalEpisodes: number;
}

export default function Dashboard(): React.ReactElement {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ApiService.baseURL}/admin/stats`, {
        headers: await ApiService.getAuthHeaders(),
      });
      const data: DashboardStats = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      Alert.alert('Error', 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncMAL = async () => {
    Alert.alert(
      'Sync with MyAnimeList',
      'This will fetch latest anime data from MAL. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sync',
          onPress: async () => {
            setSyncing(true);
            try {
              const response = await fetch(`${ApiService.baseURL}/anime/sync-mal`, {
                method: 'POST',
                headers: await ApiService.getAuthHeaders(),
              });
              const result = await response.json();
              Alert.alert('Success', result.message);
              fetchStats();
            } catch {
              Alert.alert('Error', 'Failed to sync with MAL');
            } finally {
              setSyncing(false);
            }
          }
        }
      ]
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.cyan} size="large" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome Back, ADMIN</Text>
      </View>

      {/* Quick Sync Action */}
      <TouchableOpacity
        style={[styles.syncButton, { opacity: syncing ? 0.7 : 1 }]}
        onPress={handleSyncMAL}
        disabled={syncing}
      >
        {syncing ? (
          <ActivityIndicator color={COLORS.black} size="small" />
        ) : (
          <Ionicons name="refresh" color={COLORS.black} size={20} />
        )}
        <Text style={styles.syncText}>
          {syncing ? 'Syncing MAL...' : 'Sync with MyAnimeList'}
        </Text>
      </TouchableOpacity>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>User Logins</Text>
          <Text style={styles.statValue}>
            {formatNumber(stats?.userLogins ?? 0)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Ratings Submitted</Text>
          <Text style={styles.statValue}>
            {formatNumber(stats?.ratingsSubmitted ?? 0)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>User Downloads</Text>
          <Text style={styles.statValue}>
            {formatNumber(stats?.userDownloads ?? 0)}
          </Text>
        </View>

        {/* <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Anime</Text>
          <Text style={styles.statValue}>
            {formatNumber(stats?.totalAnime ?? 0)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Episodes</Text>
          <Text style={styles.statValue}>
            {formatNumber(stats?.totalEpisodes ?? 0)}
          </Text>
        </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.black },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.text, marginTop: 12, fontSize: 14 },
  welcomeSection: { marginTop: 40, marginBottom: 30 },
  welcomeText: {
    color: COLORS.text,
    fontSize: 28,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cyan,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 30,
    justifyContent: 'center',
  },
  syncText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsContainer: { flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    marginBottom: 16,
  },
  statLabel: { color: COLORS.text, fontSize: 14, marginBottom: 8 },
  statValue: {
    color: COLORS.cyan,
    fontSize: 32,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
});
