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
import ManageAds from '../screens/ManageAds';
import CreateAds from '../screens/CreateAds';
import Splash from '../../screens/Splash';
export type AdminParamList = {
 Splash: undefined;
    AdminMain: undefined;
  AdminPanel: undefined;
  CreateAds: undefined;
  ManageAds: undefined;
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
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="AdminMain" component={AdminMain} />
      <Stack.Screen name="AdminLogin" component={AdminLogin} />
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
      <Stack.Screen name='CreateAds' component={CreateAds} />
      <Stack.Screen name='ManageAds' component={ManageAds} />
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
