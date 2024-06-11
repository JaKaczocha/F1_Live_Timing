import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews']);

const ActivityArchivalSprintResults = ({ route }) => {
  const { locationName, seasonName } = route.params;
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [sprintResults, setSprintResults] = useState([]);

  useEffect(() => {
    fetchMeetingInfo();
    fetchRaceData();
  }, [locationName, seasonName]);

  const fetchMeetingInfo = async () => {
    try {
      const apiUrl = `https://api.openf1.org/v1/meetings?year=${seasonName}&location=${locationName}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setMeetingInfo(data[0] || {});
    } catch (error) {
      console.error('Error fetching meeting info:', error);
    }
  };

  const fetchRaceData = async () => {
    try {
      const apiUrlRounds = `https://ergast.com/api/f1/${seasonName}.json`;
      const responseRounds = await fetch(apiUrlRounds);
      const dataRounds = await responseRounds.json();
      const filteredRaces = dataRounds.MRData.RaceTable.Races.filter(race => 
        race.Circuit.Location.locality.toLowerCase() === locationName.toLowerCase()
      );
      const raceRounds = filteredRaces.map(race => race.round);
      setRounds(raceRounds);
    } catch (error) {
      console.error('Error fetching race data:', error);
    }
  };

  const fetchSprintResults = async (round) => {
    try {
      const apiUrlResults = `https://ergast.com/api/f1/${seasonName}/${round}/sprint.json`;
      const responseResults = await fetch(apiUrlResults);
      const dataResults = await responseResults.json();
      if (dataResults.MRData.RaceTable.Races.length > 0) {
        const sprintResultsData = dataResults.MRData.RaceTable.Races[0].SprintResults;
        setSprintResults(prevResults => [...prevResults, { round, sprintResultsData }]);
      }
    } catch (error) {
      console.error('Error fetching sprint results:', error);
    }
  };

  useEffect(() => {
    rounds.forEach(round => fetchSprintResults(round));
  }, [rounds]);

  const renderResultItem = ({ item }) => (
    <TouchableOpacity style={styles.resultItem}>
      <Text style={styles.resultPosition}>Pos: {item.position}</Text>
      <Text style={styles.resultDriver}>Driver: {item.Driver.givenName} {item.Driver.familyName}</Text>
      <Text style={styles.resultNumber}>Number: {item.number}</Text>
     
      <Text style={styles.resultText}>Constructor: {item.Constructor.name}</Text>
      <Text style={styles.resultText}>Time: {item.Time ? item.Time.time : '-,--'}</Text>
      <Text style={styles.resultText}>Status: {item.status}</Text>
      <Text style={styles.resultText}>Fastest Lap: {item.FastestLap ? item.FastestLap.Time.time : '-,--'}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>{seasonName} - {locationName}</Text>
      {meetingInfo && (
        <View style={styles.meetingInfo}>
          <Text style={styles.infoText}>Meeting Name: {meetingInfo.meeting_name}</Text>
          <Text style={styles.infoText}>Official Name: {meetingInfo.meeting_official_name}</Text>
          <Text style={styles.infoText}>Location: {meetingInfo.location}</Text>
          <Text style={styles.infoText}>Country: {meetingInfo.country_name}</Text>
          <Text style={styles.infoText}>Circuit: {meetingInfo.circuit_short_name}</Text>
          <Text style={styles.infoText}>Date Start: {meetingInfo.date_start}</Text>
          <Text style={styles.infoText}>GMT Offset: {meetingInfo.gmt_offset}</Text>
          <Text style={styles.infoText}>Year: {meetingInfo.year}</Text>
        </View>
      )}
      <Text style={styles.subHeaderText}>Sprint Results:</Text>
      {sprintResults.map((sprint, index) => (
        <View key={index} style={styles.raceResult}>
          <Text style={styles.roundText}>Round: {sprint.round}</Text>
          <FlatList
            data={sprint.sprintResultsData}
            renderItem={renderResultItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#CCCCCC',
    marginBottom: 8,
  },
  meetingInfo: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  raceResult: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
  },
  roundText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  resultItem: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#2E2E2E',
    borderRadius: 8,
  },
  resultPosition: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',  
    marginBottom: 4,
  },
  resultNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultDriver: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', 
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ActivityArchivalSprintResults;