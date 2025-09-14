const fs = require('fs');
const path = require('path');

// Create a basic bundle directly without Metro
const basicBundle = `
/**
 * EvenUp Mobile App - Manual Bundle
 * Generated to bypass Metro bundler file descriptor issues
 */
__DEV__ = false;

// React Native polyfills
global.process = require('process');
global.Buffer = require('buffer').Buffer;

// Basic React Native components
const React = require('react');
const ReactNative = require('react-native');
const { AppRegistry, View, Text, StyleSheet, FlatList, TouchableOpacity } = ReactNative;

// EvenUp App Component
const EvenUpApp = () => {
  const [restaurants, setRestaurants] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch restaurants from backend
    fetch('http://10.0.2.2:3000/api/v1/restaurants')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched restaurants:', data);
        setRestaurants(data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
        setLoading(false);
      });
  }, []);

  const renderRestaurant = ({ item }) => (
    React.createElement(TouchableOpacity, {
      style: styles.restaurantCard,
      key: item.id
    }, [
      React.createElement(Text, { style: styles.restaurantName }, item.name),
      React.createElement(Text, { style: styles.restaurantCuisine }, item.cuisine_type),
      React.createElement(Text, { style: styles.restaurantLocation }, item.location)
    ])
  );

  if (loading) {
    return React.createElement(View, { style: styles.container }, [
      React.createElement(Text, { style: styles.title }, "EvenUp"),
      React.createElement(Text, { style: styles.loading }, "Loading restaurants...")
    ]);
  }

  return React.createElement(View, { style: styles.container }, [
    React.createElement(Text, { style: styles.title }, "EvenUp - Restaurant Bill Splitting"),
    React.createElement(Text, { style: styles.subtitle }, "Stellenbosch Restaurants"),
    React.createElement(FlatList, {
      data: restaurants,
      renderItem: renderRestaurant,
      keyExtractor: (item) => item.id.toString(),
      style: styles.list
    })
  ]);
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
  list: {
    flex: 1,
  },
  restaurantCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  restaurantLocation: {
    fontSize: 12,
    color: '#999',
  },
});

// Register the app
AppRegistry.registerComponent('EvenUpMobile', () => EvenUpApp);

console.log('EvenUp Mobile App bundle loaded successfully!');
`;

// Write the bundle
const assetsDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.writeFileSync(path.join(assetsDir, 'index.android.bundle'), basicBundle);
console.log('Manual bundle created successfully!');