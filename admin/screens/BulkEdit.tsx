// admin/screens/BulkEdit.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentPicker from 'expo-document-picker';
import AdminHeader from '../components/AdminHeader';
import { COLORS, FONTS } from '../../theme';

export default function BulkEdit(): React.ReactElement {
  const [fileName, setFileName] = useState('');

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
    if (res.type === 'success') setFileName(res.name);
  };

  const handleUpload = () => {
    if (!fileName) return Alert.alert('Select a CSV file first');
    Alert.alert('Uploaded', fileName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AdminHeader title="Bulk Edit" showBack />
      <View style={styles.content}>
        <Text style={styles.instructions}>
          1. Download the csv file and fill with proper data.{'\n'}
          2. After editing, upload and submit.{'\n'}
          3. Multiple options separated by comma.
        </Text>

        <TouchableOpacity style={styles.downloadBtn}>
          <Text style={styles.downloadText}>Download CSV File</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadArea} onPress={pickFile}>
          <Text style={styles.uploadIcon}>⬆︎</Text>
          <Text style={styles.uploadText}>
            {fileName || 'Drag and drop files or Browse'}{'\n'}
            <Text style={{ color: COLORS.cyan }}>Supported Format : CSV Only</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleUpload}>
          <Text style={styles.submitText}>Upload File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  content: { padding: 20 },
  instructions: {
    color: COLORS.text,
    fontFamily: FONTS.body,
    marginBottom: 16,
    lineHeight: 20,
  },
  downloadBtn: {
    backgroundColor: COLORS.cyan,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadText: {
    color: COLORS.black,
    fontFamily: FONTS.title,
    fontSize: 16,
  },
  uploadArea: {
    height: 200,
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadIcon: {
    fontSize: 36,
    color: '#666',
    marginBottom: 8,
  },
  uploadText: {
    color: '#666',
    fontFamily: FONTS.body,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: COLORS.cyan,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitText: {
    color: COLORS.black,
    fontFamily: FONTS.title,
    fontSize: 16,
  },
  cancelBtn: {
            backgroundColor: '#777',
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
        },
  cancelText: {
            color: COLORS.text,
            fontFamily: FONTS.body,
            fontSize: 16,
        },
});
