import React, {useState} from 'react';
import { View, Text, SafeAreaView, TextInput, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AddButton from '../assets/AddButton';
import RemoveButton from '../assets/RemoveButton';
import StartTournamentButton from '../assets/StartTournamentRound';
import { useNavigation } from '@react-navigation/native';
import { Player, StackNavigation } from '../_layout';

const SwissRoundScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const [text, setText] = useState('');

  const [inputs, setInputs] = useState<string[]>([]);
  let maxNumberOfPlayers = 8;

  const addPlayer = () => {
    if (inputs.length < maxNumberOfPlayers) {
      setInputs((prevInputs) => [...prevInputs, '']);
    } else {
      Alert.alert("Info", "Playerlimit reached");
    }
  };

  const removePlayer = () => {
    if (inputs.length > 0) {
      setInputs(inputs.filter((_, index) => index !== inputs.length - 1));
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
  };

  const handleTournamentStart = () => {
    const cleanPlayerList: Player[] = inputs
      .filter(input => input.trim() !== '')
      .map((playerName, index) => ({
        id: index + 1,
        name: playerName,
        points: 0,
        rounds: 0,
        matches: 0,
        matchWinrate: '0%',
        roundWinrate: '0%',
        seat: 0,
        roundScore: 0,
        opponents: [],
        currentOpponent: null as unknown as Player,
      }));


    if (cleanPlayerList.length < 4){
      Alert.alert("Info", "Minimum number of players are 4")
    }
    else if (cleanPlayerList.length%2 == 1) {
      Alert.alert("info", "Must be an equal number of players")
    }
    else{
      navigation.navigate('SwissTournament', { players: cleanPlayerList }); 
    }
  };
  

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient colors={['rgba(255, 170, 79, 1)', 'transparent']} 
        style={{alignItems: 'center', backgroundColor: 'rgba(240, 217, 45, 1)', flex: 1}}>
        <Text style={{fontFamily: 'InterBlack', color: 'white', fontSize: 30, marginTop: 50}}>Swiss Round</Text>
        <View style={{marginTop: 25, alignItems: 'center'}}>
          {inputs.map((input, index) => (
            <TextInput
              key={index}
              value={input}
              style={{marginBottom: 5, backgroundColor: 'rgba(249,100,50,0.99)', borderRadius: 10, width: 100}}
              placeholder="Name"
              onChangeText={(text) => handleInputChange(index, text)}
              >
            </TextInput>
          ))}
          <View style={{alignContent: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
            <AddButton onPress={addPlayer}/>
            <RemoveButton onPress={removePlayer}/>
          </View>
        </View>
        <View style={{justifyContent: 'center', alignContent: 'center', position: 'absolute', bottom: 10}}>
          <StartTournamentButton title={'Start'} onPress={handleTournamentStart} color={'#8FFF70'} pressColor={'#74DC58'}/>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};


export default SwissRoundScreen;
