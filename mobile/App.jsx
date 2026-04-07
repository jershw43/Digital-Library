import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator }     from '@react-navigation/stack';

import HomeScreen       from './screens/HomeScreen';
import ScannerScreen    from './screens/ScannerScreen';
import LibraryScreen    from './screens/LibraryScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import LoginScreen      from './screens/LoginScreen';
import RegisterScreen   from './screens/RegisterScreen';

import { AuthProvider, useAuth }       from './context/AuthContext';
import { LibraryProvider }             from './context/LibraryContext';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_BAR = { backgroundColor: '#1a1a1a', borderTopColor: '#2a2a2a' };
const HEADER  = { backgroundColor: '#1a1a1a', headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' } };

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: TAB_BAR, tabBarActiveTintColor: '#6C63FF', tabBarInactiveTintColor: '#555', headerStyle: HEADER.backgroundColor, ...HEADER }}>
      <Tab.Screen name="Home"    component={HomeScreen}    options={{ title: 'Home',    tabBarLabel: 'Home',    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }} />
      <Tab.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Scanner', tabBarLabel: 'Scan',    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📷</Text> }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ title: 'Library', tabBarLabel: 'Library', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📚</Text> }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a1a' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="Main"       component={MainTabs}       options={{ headerShown: false }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
      <Stack.Screen name="Login"      component={LoginScreen}     options={{ title: 'Log In' }} />
      <Stack.Screen name="Register"   component={RegisterScreen}  options={{ title: 'Create Account' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </LibraryProvider>
    </AuthProvider>
  );
}