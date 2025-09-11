import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import { colors } from '@constants/colors';
import RestaurantListScreen from '@screens/restaurants/RestaurantListScreen';

const Tab = createBottomTabNavigator();

// Placeholder screens - to be replaced with actual screens

const GroupsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Groups Screen - Coming Soon</Text>
  </View>
);

const OrdersScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>My Orders Screen - Coming Soon</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen - Coming Soon</Text>
  </View>
);

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Restaurants" 
        component={RestaurantListScreen}
        options={{
          title: 'Restaurants',
          // TODO: Add icon when react-native-vector-icons is configured
        }}
      />
      <Tab.Screen 
        name="Groups" 
        component={GroupsScreen}
        options={{
          title: 'Groups',
          // TODO: Add icon when react-native-vector-icons is configured
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          title: 'My Orders',
          // TODO: Add icon when react-native-vector-icons is configured
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          // TODO: Add icon when react-native-vector-icons is configured
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;