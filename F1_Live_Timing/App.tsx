/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ActivityMain from './activityMain';
import ActivityLiveResults from './activityLiveResults';
import ActivityArchivalRaces from './activityArchivalRaces';
import ActivitySelectedRace from './activitySelectedRace';
import ActivityArchivalRaceResults from './activityArchivalRaceResults';
import ActivityArchivalQualifyingResults from './activityArchivalQualifyingResults';
import ActivityArchivalSprintResults from './activityArchivalSprintResults';

function App(): React.JSX.Element {
 
  const Stack = createNativeStackNavigator();
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{
        statusBarColor: '#282828',
        headerStyle: {backgroundColor: '#8B0000'},
        headerTintColor: '#fff',
        headerTitleAlign: 'center'
      }}>

        <Stack.Screen name="LIVE TIMING" component={ActivityMain} />
        <Stack.Screen name="LIVE RESULTS" component={ActivityLiveResults}/>
        <Stack.Screen name="ARCHIVAL RACES" component={ActivityArchivalRaces}/>
        <Stack.Screen name="SELECTED RACE" component={ActivitySelectedRace}/>
        <Stack.Screen name="SELECTED RACE RESULTS" component={ActivityArchivalRaceResults}/>
        <Stack.Screen name="SELECTED QUAL RESULTS" component={ActivityArchivalQualifyingResults}/>
        <Stack.Screen name="SELECTED SPRINT RESULTS" component={ActivityArchivalSprintResults}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;
