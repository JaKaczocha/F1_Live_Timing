import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Animated, Easing, TouchableOpacity, Linking } from 'react-native';

const ActivityProfiles = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch openF1 drivers
        const responseOpenF1 = await fetch('https://api.openf1.org/v1/drivers?&session_key=latest');
        const dataOpenF1 = await responseOpenF1.json();

        // Fetch Ergast drivers
        const responseErgast = await fetch('http://ergast.com/api/f1/2024/drivers.json');
        const dataErgast = await responseErgast.json();
        
        // Merge data based on code and name_acronym
        const mergedDrivers = dataOpenF1.map(driverOpenF1 => {
          const driverErgast = dataErgast.MRData.DriverTable.Drivers.find(
            driverErgast => driverErgast.code === driverOpenF1.name_acronym
          );
          return {
            ...driverOpenF1,
            ...driverErgast,
          };
        });

        setDrivers(mergedDrivers);
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {drivers.map(driver => (
        <TouchableOpacity key={driver.driver_number} onPress={() => Linking.openURL(driver.url)}>
          <Animated.View style={{ ...styles.card, opacity: fadeAnim }}>
            <View style={styles.driverInfo}>
              <Image source={{ uri: driver.headshot_url }} style={styles.image} />
              <View>
                <Text style={styles.name}>{driver.full_name}</Text>
                <Text style={styles.team}>{driver.team_name}</Text>
                <Text style={styles.text}>Country: {driver.country_code}</Text>
                <Text style={styles.text}>Driver Number: {driver.driver_number}</Text>
                <Text style={styles.text}>Given Name: {driver.givenName}</Text>
                <Text style={styles.text}>Family Name: {driver.familyName}</Text>
                <Text style={styles.text}>Date of Birth: {driver.dateOfBirth}</Text>
                <Text style={styles.text}>Nationality: {driver.nationality}</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  container: {
    padding: 10,
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#1e1e1e',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  driverInfo: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  team: {
    fontSize: 16,
    color: '#888888',
  },
  text: {
    color: '#ffffff',
  },
});

export default ActivityProfiles;