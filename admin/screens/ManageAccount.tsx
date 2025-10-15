import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import ApiService from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS,FONTS} from '../../theme';

export default function ManageAccount(): React.ReactElement {
   const navigation = useNavigation();
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      console.log("hiiiii")
      const res = await fetch(`${ApiService.baseURL}/admin/account/me`, {
        headers: await ApiService.getAuthHeaders(),
      });
      const data = await res.json();
      console.log(data);
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
    } catch (err : any) {
      Alert.alert(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (type: 'name' | 'email' | 'password') => {
    setResetLoading(true);
    try {
      let body: any = {};
      if (type === 'name') body = { name };
      if (type === 'email') body = { email };
      if (type === 'password') {
        if (!currentPassword || !newPassword) {
          Alert.alert('Error', 'Enter current and new password');
          setResetLoading(false);
          return;
        }
        body = { currentPassword, newPassword };
      }

      const response = await fetch(`${ApiService.baseURL}/admin/account/update`, {
        method: 'PUT',
        headers: {
          ...await ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', result.message);
        if (type !== 'password') loadProfile();
        if (type === 'password') {
          setCurrentPassword('');
          setNewPassword('');
        }
      } else {
        Alert.alert('Error', result.message || 'Failed to reset');
      }
    } catch {
      Alert.alert('Error', 'Network error');
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.loading}>
      <ActivityIndicator color={COLORS.cyan} size="large" />
      <Text style={{ color: COLORS.text, marginTop: 20 }}>Loading info...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Account</Text>
      </View>

      <ScrollView style={styles.content}>
      <View >
          <Text style={styles.label}>Name of the Admin</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
            placeholder="Enter Admin Name"
            placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={() => handleReset('name')}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* EMAIL */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
            placeholder="Enter Login Mail"
            placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => handleReset('email')}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* PASSWORD */}
      <Text style={styles.label}>Password</Text>
      {/* <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Current password"
          secureTextEntry
        />
      </View> */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password (min 6 chars)"
          secureTextEntry
        />
        <TouchableOpacity onPress={() => handleReset('password')}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
      {resetLoading && (
        <ActivityIndicator color={COLORS.cyan} style={{ marginTop: 10 }} />
      )}
    
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: COLORS.black },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    marginLeft: 16,
  },
  content: { flex: 1 },
  // form: { padding: 20 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.black },
  label: { color: COLORS.cyan, fontWeight: 'bold', marginVertical: 8 },
  input: {
    backgroundColor: "#232323",
    color: "#fff",
    borderRadius: 8,
    padding: 14,
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  resetText: {
    color: COLORS.cyan,
    fontWeight: 'bold',
    marginLeft: 12,
    padding: 10,
    fontSize: 16,
  }
});
