// admin/navigation/AdminStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminPanel from '../screens/AdminPanel';
import CreateEmployee from '../screens/CreateEmployee';
import ManageAccount from '../screens/ManageAccount';
import PostAnimeContent from '../screens/PostAnimeContent';
import EditContent from '../screens/EditContent';
import BulkUpload from '../screens/BulkUpload';
import BulkEdit from '../screens/BulkEdit';
import AdminMain from '../screens/AdminMain';
import AdminLogin from '../screens/AdminLogin';

export type AdminParamList = {
  AdminMain: undefined;
  AdminPanel: undefined;
  // Remove Dashboard from here since it's used as a component, not a screen
  CreateEmployee: undefined;
  ManageAccount: undefined;
  PostAnimeContent: undefined;
  EditContent: undefined;
  BulkUpload: undefined;
  BulkEdit: undefined;
  AdminLogin: undefined;
};

const Stack = createNativeStackNavigator<AdminParamList>();

export default function AdminStack(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName="AdminMain" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminMain" component={AdminMain} />
      <Stack.Screen name="AdminLogin" component={AdminLogin} />
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
      {/* Remove Dashboard screen since it's used as a component inside AdminMain */}
      <Stack.Screen name="CreateEmployee" component={CreateEmployee} />
      <Stack.Screen name="ManageAccount" component={ManageAccount} />
      <Stack.Screen name="PostAnimeContent" component={PostAnimeContent} />
      <Stack.Screen name="EditContent" component={EditContent} />
      <Stack.Screen name="BulkUpload" component={BulkUpload} />
      <Stack.Screen name="BulkEdit" component={BulkEdit} />
    </Stack.Navigator>
  );
}
