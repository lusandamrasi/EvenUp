import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import { store } from './store/index';
import AppNavigator from './navigation/AppNavigator';
import { colors } from './constants/colors';
import { StorageService } from './services/storageService';
import { restoreAuth } from './store/slices/authSlice';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreAuthState = async () => {
      try {
        const authData = await StorageService.getAuthData();
        if (authData) {
          dispatch(restoreAuth(authData));
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
      }
    };

    restoreAuthState();
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={colors.background} 
        />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;