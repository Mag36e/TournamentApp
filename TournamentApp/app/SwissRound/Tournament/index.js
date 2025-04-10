import React from "react";
import { View, Text, SafeAreaView} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';


export default function SwissTournament( {route : {params}}) {
    //retrieving playernames
    const players = params.players;

    const seats = players.map((_, index) => index + 1);

    for (let i = 0; i < seats.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [seats[i], seats[j]] = [seats[j], seats[i]]
    }

    const assignFirstSeats = players.map((player, index) => {
        return { player, seat: seats[index] };
    });

    console.log(assignFirstSeats)
    

    return (
        <SafeAreaView style={{flex: 1}}>
            <LinearGradient colors={['rgb(32, 240, 129)', 'transparent']} 
            style={{alignItems: 'center', backgroundColor: 'rgb(54, 242, 37)', flex: 1}}>

                <View style={{flex: 1, alignSelf: 'center'}}>
                    <Text>id: { players[0].id }</Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );


};