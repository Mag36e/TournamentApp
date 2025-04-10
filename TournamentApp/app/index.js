import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, Alert} from 'react-native';
import * as Font from 'expo-font';
import Button from './assets/TournamentButton';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';



const HomeScreen = () => {
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'InterBlack': require('./assets/fonts/InterBlack.ttf'),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }


  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient colors={['rgba(79, 161, 255, 1)', 'transparent']} 
              style={{alignItems: 'center', backgroundColor: 'rgba(129, 181, 167, 1)', flex: 1}}>
      <View style={{alignItems: 'center', marginTop: 100}}>
        <Text style={{color: 'white', fontFamily: 'InterBlack', fontSize: 30}}>Tournament App</Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 100}}>
          <Button title={'Swiss Round'} onPress={() => navigation.navigate('SwissRound')} color={'#8FFF70'} pressColor={'#74DC58'}/>
      </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;