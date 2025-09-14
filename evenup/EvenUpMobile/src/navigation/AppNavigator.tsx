import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated } from '../store/slices/authSlice';
import RestaurantListScreen from '../screens/restaurants/RestaurantListScreen';

const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <RestaurantListScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EvenUp</Text>
      <Text style={styles.subtitle}>Welcome to EvenUp - Restaurant Bill Splitting</Text>
      <RestaurantListScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
});

export default AppNavigator;