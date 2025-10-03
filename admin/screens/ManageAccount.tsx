// admin/screens/ManageAccount.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminHeader from '../components/AdminHeader';
import FormInput from '../components/FormInput';
import { COLORS, FONTS } from '../../theme';

export default function ManageAccount(): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader title="Manage Account" showBack />
      <ScrollView style={styles.content}>
        <FormInput
          label="Name of the Admin"
          value={name}
          onChangeText={setName}
          placeholder="Enter Admin Name"
        />
        <FormInput
          label="Login Mail"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Login Mail"
          showReset
        />
        <FormInput
          label="Login Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Password"
          secureTextEntry
          showReset
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  content: { padding: 20 },
});
