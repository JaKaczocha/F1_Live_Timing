import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ActivityArchivalQualifyingResults = ({ route }) => {
  const { locationName, seasonName } = route.params;
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [qualifyingResults, setQualifyingResults] = useState([]);

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

  const fetchQualifyingResults = async (round) => {
    try {
      const apiUrlResults = `https://ergast.com/api/f1/${seasonName}/${round}/qualifying.json`;
      const responseResults = await fetch(apiUrlResults);
      const dataResults = await responseResults.json();
      if (dataResults.MRData.RaceTable.Races.length > 0) {
        const results = dataResults.MRData.RaceTable.Races[0].QualifyingResults;
        setQualifyingResults(prevResults => [...prevResults, { round, results }]);
      }
    } catch (error) {
      console.error('Error fetching qualifying results:', error);
    }
  };

  useEffect(() => {
    rounds.forEach(round => fetchQualifyingResults(round));
  }, [rounds]);

  const renderResultItem = ({ item }) => (
    <TouchableOpacity style={styles.resultItem}>
      <Text style={styles.resultText}>Pos: {item.position}</Text>
      <Text style={styles.resultText}>Number: {item.number}</Text>
      <Text style={styles.resultText}>Driver: {item.Driver.givenName} {item.Driver.familyName}</Text>
      <Text style={styles.resultText}>Constructor: {item.Constructor.name}</Text>
      <Text style={styles.resultText}>Q1: {item.Q1}</Text>
      <Text style={styles.resultText}>Q2: {item.Q2}</Text>
      <Text style={styles.resultText}>Q3: {item.Q3}</Text>
      
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
      <Text style={styles.subHeaderText}>Qualifying Results:</Text>
      {qualifyingResults.map((qualifying, index) => (
        <View key={index} style={styles.raceResult}>
          <Text style={styles.roundText}>Round: {qualifying.round}</Text>
          <FlatList
            data={qualifying.results}
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
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meetingInfo: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
  },
  raceResult: {
    marginBottom: 16,
  },
  roundText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultItem: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
  },
});

export default ActivityArchivalQualifyingResults;
