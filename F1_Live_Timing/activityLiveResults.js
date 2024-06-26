import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Animated, Easing } from 'react-native';
import axios from 'axios';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);
const ActivityLiveResults = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingName, setMeetingName] = useState('');
  const progress = useRef(new Animated.Value(0)).current;

  const fetchMeetingData = async () => {
    try {
      const meetingResponse = await axios.get('https://api.openf1.org/v1/meetings?meeting_key=latest');
      const meetingData = meetingResponse.data;
      setMeetingName(meetingData[0].meeting_name); 
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDriverData = async () => {
    try {
      const driversResponse = await axios.get('https://api.openf1.org/v1/drivers?session_key=latest');
      const driversData = driversResponse.data;

      const intervalsResponse = await axios.get('https://api.openf1.org/v1/intervals?meeting_key=latest');
      const intervals = intervalsResponse.data.reverse();

      const combinedData = driversData.map(driver => {
        const matchingInterval = intervals.find(interval => interval.driver_number === driver.driver_number);
        return {
          ...driver,
          gap_to_leader: matchingInterval ? matchingInterval.gap_to_leader : null,
          interval: matchingInterval ? matchingInterval.interval : null
        };
      });

      setDrivers(combinedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const startProgressAnimation = () => {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    };

    const fetchData = async () => {
      await fetchDriverData();
      await fetchMeetingData();
      startProgressAnimation();
    };

    fetchData();
    const intervalId = setInterval(fetchData, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Error: {error}</Text>
      </View>
    );
  }

  const sortedDrivers = drivers.sort((a, b) => {
    const parseGap = (gap) => {
      if (typeof gap === 'number') {
        return gap;
      }
      if (typeof gap === 'string' && gap.includes('L')) {
        return parseFloat(gap) * 500;
      }
      return parseFloat(gap);
    };

    const gapA = parseGap(a.gap_to_leader);
    const gapB = parseGap(b.gap_to_leader);

    return gapA - gapB;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>{meetingName || 'Loading Meeting Name...'}</Text>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>
      {sortedDrivers.length > 0 ? (
        sortedDrivers.map((driver, index) => (
          <View key={driver.driver_number} style={styles.driverContainer}>
            <Text style={styles.position}>{index + 1}</Text>
            <View style={[styles.teamColorBar, { backgroundColor: `#${driver.team_colour}` }]} />
            <Image source={{ uri: driver.headshot_url }} style={styles.headshot} />
            <View style={styles.driverInfo}>
              <View style={styles.driverNameContainer}>
                <Text style={styles.driverName}>{driver.full_name}</Text>
                <Text style={styles.countryCode}>{driver.country_code}</Text>
              </View>
              <Text style={styles.driverDetails}>Team: {driver.team_name}</Text>
              <Text style={styles.driverDetails}>Gap to Leader: {driver.gap_to_leader !== null ? driver.gap_to_leader : 'N/A'}</Text>
              <Text style={styles.driverDetails}>Interval: {driver.interval !== null ? driver.interval : 'N/A'}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.text}>No drivers found for this session</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#333333',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF', 
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 5,
    backgroundColor: '#1E1E1E',
    width: '100%',
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  teamColorBar: {
    width: 10,
    height: '100%',
    marginRight: 10,
  },
  headshot: {
    width: 40,
    height: 40,
    marginRight: 20,
    borderRadius: 20,
  },
  driverInfo: {
    flex: 1,
  },
  driverNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  countryCode: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  driverDetails: {
    color: '#CCCCCC',
  },
});

export default ActivityLiveResults;