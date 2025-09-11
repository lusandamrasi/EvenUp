import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { colors } from '@constants/colors';
import { Restaurant } from '@types/restaurant.types';
import { useGetRestaurantsQuery } from '@store/api/restaurantApi';
import Button from '@components/common/Button';

interface RestaurantListScreenProps {
  navigation: StackNavigationProp<any>;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardContent}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
      {restaurant.cuisine_type && (
        <Text style={styles.cuisineType}>{restaurant.cuisine_type}</Text>
      )}
      {restaurant.description && (
        <Text style={styles.description} numberOfLines={2}>
          {restaurant.description}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

const RestaurantListScreen: React.FC<RestaurantListScreenProps> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  const {
    data: restaurantsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetRestaurantsQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const restaurants = restaurantsData?.data?.restaurants || [];
  const pagination = restaurantsData?.data?.pagination;

  const handleRestaurantPress = (restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
  };

  const handleLoadMore = () => {
    if (pagination && page < pagination.pages) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => handleRestaurantPress(item)}
    />
  );

  const renderFooter = () => {
    if (!pagination || page >= pagination.pages) return null;
    
    return (
      <View style={styles.footerContainer}>
        <Button
          title="Load More"
          onPress={handleLoadMore}
          variant="outline"
          style={styles.loadMoreButton}
        />
      </View>
    );
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error loading restaurants: {(error as any)?.data?.error || 'Unknown error'}
          </Text>
          <Button title="Retry" onPress={refetch} style={styles.retryButton} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurants</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isLoading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderRestaurant}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.backgroundSecondary,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cuisineType: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    minWidth: 120,
  },
});

export default RestaurantListScreen;