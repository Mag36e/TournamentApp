import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './index';
import SwissRoundScreen from './SwissRound';
import SwissTournament from './SwissRound/Tournament';

export interface Player {
  id: number;
  name: string;
  points: number;
  rounds: number;
  matches: number;
  matchWinrate: string;
  roundWinrate: string;
}

export type RootTabParamList = {
  Home: undefined;
  SwissRound: undefined;
  SwissTournament: {
    players: Player[] | undefined;
  }
}

const Stack = createNativeStackNavigator<RootTabParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SwissRound" component={SwissRoundScreen} />
      <Stack.Screen name="SwissTournament" component={SwissTournament} initialParams={{ players: undefined }}/>
    </Stack.Navigator>
  )
}