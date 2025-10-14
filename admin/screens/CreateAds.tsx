// admin/screens/CreateAds.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS, FONTS } from '../../theme';
import ApiService from '../../services/api';

interface ImageAsset {
  uri: string;
  type?: string;
  fileName?: string;
}

interface FormData {
  title: string;
  description: string;
  ctaText: string;
  targetUrl: string;
  targetUsers: string;
  priority: string;
  budget: string;
  costPerView: string;
  adType: string;
  startDate: Date;
  endDate: Date | null;
  bannerImage: ImageAsset | null;
}

export default function CreateAds(): React.ReactElement {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Form state with proper typing
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    ctaText: 'Learn More',
    targetUrl: '',
    targetUsers: '1000',
    priority: '1',
    budget: '0',
    costPerView: '0',
    adType: 'banner',
    startDate: new Date(),
    endDate: null,
    bannerImage: null
  });

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const selectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access photos is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        updateFormData('bannerImage', {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || 'image.jpg'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const generatePreview = () => {
    if (!formData.bannerImage || !formData.title) {
      Alert.alert('Preview', 'Please add title and banner image to preview');
      return;
    }

    Alert.alert(
      'Ad Preview',
      `Title: ${formData.title}\nDescription: ${formData.description}\nCTA: ${formData.ctaText}\nTarget Users: ${formData.targetUsers}`,
      [{ text: 'OK' }]
    );
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Description is required');
      return false;
    }
    if (!formData.bannerImage) {
      Alert.alert('Validation Error', 'Banner image is required');
      return false;
    }
    if (!formData.targetUsers || parseInt(formData.targetUsers) < 1) {
      Alert.alert('Validation Error', 'Target users must be at least 1');
      return false;
    }
    return true;
  };

  const submitAd = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Add image
      if (formData.bannerImage) {
        const imageUri = formData.bannerImage.uri;
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formDataToSend.append('bannerImage', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      // Add other fields
      const fieldsToAdd: (keyof FormData)[] = [
        'title', 'description', 'ctaText', 'targetUrl', 
        'targetUsers', 'priority', 'budget', 'costPerView', 'adType'
      ];

      fieldsToAdd.forEach(key => {
        const value = formData[key];
        if (typeof value === 'string') {
          formDataToSend.append(key, value);
        }
      });

      formDataToSend.append('startDate', formData.startDate.toISOString());
      
      if (formData.endDate) {
        formDataToSend.append('endDate', formData.endDate.toISOString());
      }

      const response = await fetch(`${ApiService.baseURL}/ads`, {
        method: 'POST',
        headers: {
          ...await ApiService.getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Ad created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to create ad');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      updateFormData('startDate', selectedDate);
    }
  };

  const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      updateFormData('endDate', selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Ads</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Target Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Range</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the number of users to display ad"
            placeholderTextColor="#666"
            value={formData.targetUsers}
            onChangeText={(text) => updateFormData('targetUsers', text)}
            keyboardType="numeric"
          />
        </View>

        {/* Upload Banner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Banner</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            {formData.bannerImage ? (
              <Image 
                source={{ uri: formData.bannerImage.uri }} 
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <>
                <Ionicons name="cloud-upload" color="#666" size={48} />
                <Text style={styles.uploadText}>Upload Banner</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Ad Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ad Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ad title"
            placeholderTextColor="#666"
            value={formData.title}
            onChangeText={(text) => updateFormData('title', text)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter ad description"
            placeholderTextColor="#666"
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CTA Button Text</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the text to be added on CTA"
            placeholderTextColor="#666"
            value={formData.ctaText}
            onChangeText={(text) => updateFormData('ctaText', text)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com"
            placeholderTextColor="#666"
            value={formData.targetUrl}
            onChangeText={(text) => updateFormData('targetUrl', text)}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        {/* Advanced Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority (1-10)</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            placeholderTextColor="#666"
            value={formData.priority}
            onChangeText={(text) => updateFormData('priority', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#666"
            value={formData.budget}
            onChangeText={(text) => updateFormData('budget', text)}
            keyboardType="numeric"
          />
        </View>

        {/* Date Pickers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start Date</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formData.startDate.toLocaleDateString()}
            </Text>
            <Ionicons name="calendar" color={COLORS.cyan} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>End Date (Optional)</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formData.endDate ? formData.endDate.toLocaleDateString() : 'No end date'}
            </Text>
            <Ionicons name="calendar" color={COLORS.cyan} size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.previewButton} onPress={generatePreview}>
          <Text style={styles.previewButtonText}>Generate Preview</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.submitButton, { opacity: loading ? 0.7 : 1 }]}
          onPress={submitAd}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.black} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Ad</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={formData.startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={formData.endDate || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: COLORS.cyan,
    fontSize: 16,
    fontFamily: FONTS.title,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.body,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#666',
    fontSize: 16,
    fontFamily: FONTS.body,
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  dateButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.body,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  previewButton: {
    backgroundColor: '#666',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  previewButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: COLORS.cyan,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: FONTS.title,
    fontWeight: 'bold',
  },
});
