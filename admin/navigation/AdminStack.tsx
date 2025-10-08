// admin/navigation/AdminStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminPanel from '../screens/AdminPanel';
import Dashboard from '../screens/Dashboard';
import CreateEmployee from '../screens/CreateEmployee';
import ManageAccount from '../screens/ManageAccount';
import PostAnimeContent from '../screens/PostAnimeContent';
import EditContent from '../screens/EditContent';
import BulkUpload from '../screens/BulkUpload';
import BulkEdit from '../screens/BulkEdit';

export type AdminParamList = {
  AdminPanel: undefined;
  Dashboard: undefined;
  CreateEmployee: undefined;
  ManageAccount: undefined;
  PostAnimeContent: undefined;
  EditContent: undefined;
  BulkUpload: undefined;
  BulkEdit: undefined;
};

const Stack = createNativeStackNavigator<AdminParamList>();

export default function AdminStack(): React.ReactElement {
  return (
    <Stack.Navigator initialRouteName="AdminPanel" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="CreateEmployee" component={CreateEmployee} />
      <Stack.Screen name="ManageAccount" component={ManageAccount} />
      <Stack.Screen name="PostAnimeContent" component={PostAnimeContent} />
      <Stack.Screen name="EditContent" component={EditContent} />
      <Stack.Screen name="BulkUpload" component={BulkUpload} />
      <Stack.Screen name="BulkEdit" component={BulkEdit} />
    </Stack.Navigator>
  );
}
