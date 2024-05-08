import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ActivityArchivalRaces = () => {
    const [sessions, setSessions] = useState([]);
    const [years, setYears] = useState([]);
    const [expandedYear, setExpandedYear] = useState(null);
    const [uniqueLocations, setUniqueLocations] = useState([]);

    useEffect(() => {
      fetchData();
    }, []);

    useEffect(() => {
      if (sessions.length > 0) {
        const uniqueLocationsSet = new Set(sessions.map(item => item.location));
        setUniqueLocations(Array.from(uniqueLocationsSet));
      }
    }, [sessions]);

    const fetchData = async () => {
      try {
        const response = await fetch('https://api.openf1.org/v1/sessions');
        const data = await response.json();
        setSessions(data);
        const uniqueYears = [...new Set(data.map(item => item.year))];
        setYears(uniqueYears);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const renderLocationItem = ({ item, index }) => (
      <View style={[styles.item, index % 2 === 1 ? styles.itemEven : null]}>
        <Text style={styles.location}>{item}</Text>
      </View>
    );

    const handleYearPress = (year) => {
      setExpandedYear(expandedYear === year ? null : year);
    };

    return (
      <View style={styles.container}>
        {years.map(year => (
          <View key={year}>
            <TouchableOpacity
              onPress={() => handleYearPress(year)}
              style={[styles.yearButton, { width: '100%', backgroundColor: '#282828'}]}
            >
              <View style={styles.bar}>
                  <Text style={styles.barText}>{year} Season</Text>
              </View>
            </TouchableOpacity>
            {expandedYear === year && (
              <FlatList
                data={uniqueLocations.filter(location =>
                  sessions.some(session => session.year === year && session.location === location)
                )}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
        ))}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: '#282828'
  },
  item: {
    
    padding: 20,
    borderBottomWidth: 1,
   
  },
  itemEven: {
    backgroundColor: '#000000', // Background color for every other item
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  yearButton: {
    
    backgroundColor: '#8B0000',
    paddingBottom: 8,
    width: "100%"
  },
  bar: {
    paddingBottom: 8,
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  barText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
  },
});

export default ActivityArchivalRaces;