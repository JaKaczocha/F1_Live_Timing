
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList,Image } from 'react-native';




const ActivitySelectedRace = ({ navigation, route }) => {
    
    const trackImages = [
        { id: 'Austin', path: require('./assety/tory/Austin.png') },
        { id: 'Mexico City', path: require('./assety/tory/Mexico-City.png') },
        { id: 'Spa-Francorchamps', path: require('./assety/tory/Spa-Francorchamps.png') },
        { id: 'Baku', path: require('./assety/tory/Baku.png') },
        { id: 'Miami', path: require('./assety/tory/Miami.png') },
        { id: 'Spielberg', path: require('./assety/tory/Spielberg.png') },
        { id: 'Barcelona', path: require('./assety/tory/Barcelona.png') },
        //{ id: 'Monte Carlo', path: require('./assety/tory/Monte-Carlo.png') },
        { id: 'Suzuka', path: require('./assety/tory/Suzuka.png') },
        { id: 'Budapest', path: require('./assety/tory/Budapest.png') },
        { id: 'Montréal', path: require('./assety/tory/Montreal.png') },
        { id: 'Yas Marina Circuit', path: require('./assety/tory/Yas-Marina-Circuit.png') },
        { id: 'São Paulo', path: require('./assety/tory/Sao-Paulo.png') },
        { id: 'Monza', path: require('./assety/tory/Monza.png') },
        { id: 'Zandvoort', path: require('./assety/tory/Zandvoort.png') },
        { id: 'Jeddah', path: require('./assety/tory/Jeddah.png') },
        { id: 'Sakhir', path: require('./assety/tory/Sakhir.png') },
        { id: 'Monaco', path: require('./assety/tory/Monaco.png') },
        { id: 'Las Vegas', path: require('./assety/tory/Las-Vegas.png') },
        { id: 'Shanghai', path: require('./assety/tory/Shanghai.png') },
        { id: 'Imola', path: require('./assety/tory/Imola.png') },
        { id: 'Lusail', path: require('./assety/tory/Lusail.png') },
        { id: 'Silverstone', path: require('./assety/tory/Silverstone.png') },
        { id: 'Melbourne', path: require('./assety/tory/Melbourne.png') },
        { id: 'Marina Bay', path: require('./assety/tory/Marina-Bay.png') },
      ];

  const { locationName, seasonName } = route.params;
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `https://api.openf1.org/v1/sessions?location=${locationName}&year=${seasonName}`;
        const response = await fetch(apiUrl, { timeout: 60000 });
        const data = await response.json();
        setSessions(data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [locationName, seasonName]);

  useEffect(() => {
    // Konfiguracja nagłówka nawigacji
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: 'white' }]}>{locationName}</Text>
          <Text style={[styles.headerText, { color: 'white' }]}>{seasonName}</Text>
        </View>
      ),
    });
  }, [locationName, seasonName, navigation]);


  const getImagePath = (locationName) => {
    const track = trackImages.find(track => track.id == locationName);
    return track ? track.path : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBar}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Select session</Text>
      </View>

      <FlatList
        style={styles.list}
        data={sessions}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              if (item.session_name === 'Race') {
                navigation.navigate('SELECTED RACE RESULTS', {
                  locationName: locationName,
                  seasonName: seasonName,   
                });
              }
              else if (item.session_name === 'Sprint') {
                navigation.navigate('SELECTED SPRINT RESULTS', {
                  locationName: locationName,
                  seasonName: seasonName,   
                });
              }
              else if (item.session_name === 'Qualifying') {
                navigation.navigate('SELECTED QUAL RESULTS', {
                  locationName: locationName,
                  seasonName: seasonName,   
                });
              }
            }}
            style={styles.sessionTouch}
          >
            <View style={[styles.sessionBar, index % 2 === 1 ? styles.sessionBarEven : null]}>
              <Text style={styles.sessionName}>{item.session_name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.session_key.toString()}
      />

      <Text style={{ color: 'white', fontSize: 24 }}> {locationName} circuit</Text>
      <Image
        style={styles.image}
        source={getImagePath(locationName)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282828',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: '400',
    marginRight: 10,
    color: 'white'
  },
  sessionBar: {
    backgroundColor: '#333333',
    padding: 10,
    width: '100%'
  },
  sessionBarEven: {
    backgroundColor: 'black',
  },
  sessionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#ffffff",
    textAlign: 'center'
  },
  sessionTouch: {
    width: '100%'
  },
  list: {
    width: '100%'
  }, 
  image: {
    width: '100%',
    height: '30%',
    resizeMode: 'center',
    marginBottom: '40%'
  },
  infoBar: {
    backgroundColor: '#5a0000',
    padding: 10,
    width: '100%'
  }
});

export default ActivitySelectedRace;