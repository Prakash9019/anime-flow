// screens/CreateEmployee.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminHeader from '../components/AdminHeader';
import FormInput from '../components/FormInput';
import ToggleSwitch from '../components/ToggleSwitch';
import { COLORS, FONTS } from '../../theme';

export default function CreateEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permissions: {
      postContent: true,
      editContent: false,
      bulkUpload: false,
      bulkEdit: false,
      createAds: false,
    }
  });

  const handlePermissionChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: value }
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader title="Create Employee" showBack />
      
      <ScrollView style={styles.content}>
        <FormInput
          label="Name of the Employee"
          placeholder="Enter Employee Name"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
        />

        <FormInput
          label="Login Mail"
          placeholder="Enter Login Mail"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
          showReset
        />

        <FormInput
          label="Login Password"
          placeholder="Enter Password"
          value={formData.password}
          onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          secureTextEntry
          showReset
        />

        <View style={styles.accessSection}>
          <Text style={styles.sectionTitle}>Access</Text>
          
          <ToggleSwitch
            label="Post Anime Content"
            value={formData.permissions.postContent}
            onValueChange={(value) => handlePermissionChange('postContent', value)}
          />

          <ToggleSwitch
            label="Edit Existing Anime Content"
            value={formData.permissions.editContent}
            onValueChange={(value) => handlePermissionChange('editContent', value)}
          />

          <ToggleSwitch
            label="Bulk Upload"
            value={formData.permissions.bulkUpload}
            onValueChange={(value) => handlePermissionChange('bulkUpload', value)}
          />

          <ToggleSwitch
            label="Bulk Edit"
            value={formData.permissions.bulkEdit}
            onValueChange={(value) => handlePermissionChange('bulkEdit', value)}
          />

          <ToggleSwitch
            label="Create Ads"
            value={formData.permissions.createAds}
            onValueChange={(value) => handlePermissionChange('createAds', value)}
          />
        </View>
      </ScrollView>
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
  accessSection: {
    marginTop: 20,
  },
  sectionTitle: {
    color: COLORS.cyan,
    fontSize: 18,
    fontFamily: FONTS.title,
    marginBottom: 20,
  },
});
