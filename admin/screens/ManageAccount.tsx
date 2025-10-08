// admin/screens/ManageAccount.tsx (updated)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../theme';

export default function ManageAccount(): React.ReactElement {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Account</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Name of the Admin</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter Admin Name"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Login Mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Login Mail"
            placeholderTextColor="#666"
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.resetButton}>
            <Text style={styles.resetText}>Reset Login Mail</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Login Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter Password"
            placeholderTextColor="#666"
            secureTextEntry
          />
          <TouchableOpacity style={styles.resetButton}>
            <Text style={styles.resetText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
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
  form: { padding: 20 },
  label: {
    color: COLORS.cyan,
    fontSize: 14,
    fontFamily: FONTS.body,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  resetButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  resetText: {
    color: COLORS.cyan,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
