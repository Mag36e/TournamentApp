import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './index';
import SwissRoundScreen from './SwissRound';
import SwissTournament from './SwissRound/Tournament';
import { NavigationProp } from '@react-navigation/native';

export interface Player {
  id: number;
  name: string;
  points: number;
  rounds: number;
  matches: number;
  matchWinrate: string;
  roundWinrate: string;
  seat: number;
  roundScore: number;
  opponents: Player[];
  currentOpponent: Player;
}

export type RootTabParamList = {
  Home: undefined;
  SwissRound: undefined;
  SwissTournament: {
    players: Player[] | undefined;
  }
}

export type ScreenNames = ["Home", "SwissRound", "SwissTournament"]
export type RootStackParamList = Record<ScreenNames[number], any>;
export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootTabParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SwissRound" component={SwissRoundScreen} />
      <Stack.Screen name="SwissTournament" component={SwissTournament} />
    </Stack.Navigator>
  )
}