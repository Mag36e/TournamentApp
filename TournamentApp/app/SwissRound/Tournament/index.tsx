import React, {useState, useMemo} from 'react';
import { View, Text, SafeAreaView, Modal, Pressable} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { Player } from "@/app/_layout";
import { StaticScreenProps } from "@react-navigation/native";
import AddScoreButton from './assets/AddScoreButton';
import RemoveScoreButton from './assets/RemoveScoreButton';
import NewRoundButton from './assets/NewRoundButton';


type Props = StaticScreenProps<{
    players: Player[] | undefined
}>

export default function SwissTournament({
    route
} : Props) {
    if (!route.params.players) throw new Error("Players has to be defined for this route to work");
    
    const immutablePlayers = route.params.players;
    const [round, setRound] = useState(1);

    
    const [modalVisible, setModalVisible] = useState(false);
    
    const [tableNum, setTableNum] = useState(0);

    const [roundButton, setRoundButton] = useState("Next Round");
    
    
    const [players, setPlayers] = useState(() => {
        const playersCopy = JSON.parse(JSON.stringify(immutablePlayers)) as Player[];
        const seats = playersCopy.map((_, index) => index + 1);
        
        if (round === 1) {
            for (let i = 0; i < seats.length; i++) {
                const j = Math.floor(Math.random() * (i + 1));
                [seats[i], seats[j]] = [seats[j], seats[i]];
            }
            
            for (let i = 0; i < playersCopy.length; i++) {
                playersCopy[i].seat = seats[i];
                
            }
            playersCopy.sort((a, b) => a.seat - b.seat);
            for (let i = 0; i < playersCopy.length; i++) {
                if (playersCopy[i].seat % 2 === 1) {
                    playersCopy[i].currentOpponent = playersCopy[i + 1];
                }
                else {
                    playersCopy[i].currentOpponent = playersCopy[i - 1];
                }
            }
        }
        
        return playersCopy;
    });
    
    const [inputs, setInputs] = useState<string[]>(() => {
        return Array(Math.ceil(players.length / 2)).fill('');
    });
    
    const pickPlayerbySeat = (seatNum: number): Player => {
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.seat === seatNum) {
                return player
            }
        }
        return {id: 0,
            name: "Not Found",
            points: 0,
            rounds: 0,
            matches: 0,
            matchWinrate: '0%',
            roundWinrate: '0%',
            seat: 0,
            roundScore: 0,
            opponents: [],
            currentOpponent: null as unknown as Player,
    }}

    const pickPlayerbyPoints = (points: number): Player => {
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.points === points) {
                return player
            }
        }
        return {id: 0,
            name: "Not Found",
            points: 0,
            rounds: 0,
            matches: 0,
            matchWinrate: '0%',
            roundWinrate: '0%',
            seat: 0,
            roundScore: 0,
            opponents: [],
            currentOpponent: null as unknown as Player,
    }}

    const maxNumberOfRounds = () => {
        if (players.length <= 8) {
            return 3;
        } else if (players.length <= 16) {
            return 4;
        } else if (players.length <= 32) {
            return 5;
        } else if (players.length <= 64) {
            return 6;
        } else if (players.length <= 128) {
            return 7;
        } else if (players.length <= 226) {
            return 8;
        } else if (players.length <= 409) {
            return 9;
        } else if (players.length >= 410) {
            return 10;
        } else {
            return 0;
        }
    }

    function handleTablePopup(tableNumber: number) {
        setModalVisible(true);
        setTableNum(tableNumber);
    }

    // The following function handles the logic for adding and removing scores for each player.
    // This applies when adding points for winning a round.
    function handleTableScore(tableNumber: number, playerNumber: number, scoreMod: number) {
        const seatNum = (tableNumber - 1) * 2 + playerNumber;
        setPlayers(prevPlayers => {
            return prevPlayers.map(player => {
                const opponent = player.seat % 2 === 1 ? pickPlayerbySeat(player.seat + 1) : pickPlayerbySeat(player.seat - 1);
                if (!opponent) return player;
                if (player.seat === seatNum) {
                    if (player.roundScore !== 2 && scoreMod === 1 && player.roundScore + opponent.roundScore < 3) {
                        return { ...player, roundScore: player.roundScore + scoreMod };
                    }
                    else if (player.roundScore !== 0 && scoreMod === -1) {
                        return { ...player, roundScore: player.roundScore + scoreMod };
                    }
                }
                return player;
            });
        });
    }

    // The following functions handle the logic for the next round.
    // It checks if the player has already played against the opponent and if so, it will not allow them to play again.
    function handleNewRound() {
        let draw = false;
        setPlayers(prevPlayers => {
            const updatedPlayers = prevPlayers.map(player => {
                const opponent = player.seat % 2 === 1 ? pickPlayerbySeat(player.seat + 1) : pickPlayerbySeat(player.seat - 1);
                if (!opponent) return player;
                player.opponents.push(opponent);

                if (player.roundScore === 1 && opponent.roundScore === 1 || player.roundScore === 0 && opponent.roundScore === 0) {
                    draw = true;
                }
                if (draw) {
                    player.points += 1;
                    draw = false;
                }
                if (player.roundScore > opponent.roundScore) {
                    player.points += 3;
                }
                player.rounds += player.roundScore + opponent.roundScore;
                player.matches += 1;
                return { ...player, roundScore: 0, currentOpponent: null as unknown as Player, seat: 0 };
            });
            
            return updatedPlayers;
        });
        setModalVisible(false);
        setTableNum(0);
        if (round < maxNumberOfRounds()) {
            setRound(prevRound => prevRound + 1);
            assignSeats();
        }
        if (round === maxNumberOfRounds() - 1) {
            setRoundButton("End Tournament");
        }
        else if (round === maxNumberOfRounds()) {
            // go to tournament end screen
        }

        console.log(players.map(player => player.name + " " + player.seat));
    }

    function assignSeats() {
        setPlayers(prevPlayers => {
            prevPlayers.sort((a, b) => a.points - b.points);
            let seats = prevPlayers.map((_, index) => index + 1);
            for (let i = 0; i < prevPlayers.length; i++) {
                const player = prevPlayers[i];
                if (player.seat === 0 && !hasPlayedOpponent(player)) {
                    player.seat = seats[i];
                    //prevPlayers[]
                }
            }
            /* for (let i = 0; i < seats.length; i++) {
                if (prevPlayers[i].seat === 0) {
                    prevPlayers[i].seat = seats[i];
                    prevPlayers[prevPlayers.indexOf(prevPlayers[i].currentOpponent)].seat = seats[i] + 1;
                }
            } */
            console.log(prevPlayers.map(player => player.name + ": " + player.seat + ", " + player.currentOpponent.name + ": " + player.currentOpponent.seat + "||"));

            return prevPlayers;
        });
    }

    function hasPlayedOpponent(player: Player): boolean {
        for (let i = 0; i < player.opponents.length; i++) {
            return false
        }
        return true
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <LinearGradient colors={['rgb(32, 240, 129)', 'transparent']} 
            style={{alignItems: 'center', backgroundColor: 'rgb(54, 242, 37)', flex: 1}}>
                <Text style={{color: 'white', fontFamily: 'InterBlack', fontSize: 30}}>Round {round}</Text>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{backgroundColor: 'white', width: 300, height: 200, borderRadius: 20, alignItems: 'center'}}>
                            <View style={{marginTop: 20}}>
                                <Text style={{fontFamily: 'InterBlack', fontSize: 20}}>{tableNum}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text style={{marginLeft: 10}}>{pickPlayerbySeat((tableNum - 1) * 2 + 1)?.name}</Text>
                                <Text style={{marginLeft: 20, marginRight: 10}}>{pickPlayerbySeat((tableNum - 1) * 2 + 1)?.roundScore}</Text>
                                <AddScoreButton onPress={() => handleTableScore(tableNum, 1, 1)} />
                                <RemoveScoreButton onPress={() => handleTableScore(tableNum, 1, -1)} />
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text style={{marginLeft: 10}}>{pickPlayerbySeat((tableNum - 1) * 2 + 2)?.name}</Text>
                                <Text style={{marginLeft: 20, marginRight: 10}}>{pickPlayerbySeat((tableNum - 1) * 2 + 2)?.roundScore}</Text>
                                <AddScoreButton onPress={() => handleTableScore(tableNum, 2, 1)} />
                                <RemoveScoreButton onPress={() => handleTableScore(tableNum, 2, -1)} />

                            </View>
                            <View style={{}}>
                                <Pressable onPress={() => setModalVisible(!modalVisible)} style={{borderColor: 'black', borderWidth: 1, borderRadius: 10, padding: 10, margin: 10}}>
                                    <Text style={{fontFamily: 'InterBlack', fontSize: 20}}>OK</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={{flex: 1, alignSelf: 'center'}}>
                    {inputs.map((input, index: number) => (
                        <Pressable key={index} style={{marginBottom: 20}} onPress={() => handleTablePopup(index + 1)}>
                            <View style={{backgroundColor: 'rgb(256,256,256)', height: 125, width: 200, borderRadius: 20}}>
                                <Text style={{fontFamily: 'Inter', fontSize: 20, alignSelf: 'center', marginTop: 5, marginBottom: 10}}>{index + 1}</Text>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{marginLeft: 10}}>Name</Text>
                                    <Text style={{marginLeft: 37, marginRight: 37}}>Seat</Text>
                                    <Text style={{marginRight: 10}}>Points</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                    <View style={{flex: 1}}>
                                        <Text style={{fontFamily: 'Inter', fontSize: 15, marginBottom: 5, marginLeft: 10}}>
                                        { pickPlayerbySeat((index) * 2 + 1)?.name }
                                        </Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <Text style={{fontFamily: 'Inter', fontSize: 15}}>{ pickPlayerbySeat((index) * 2 + 1)?.seat }</Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <Text style={{fontFamily: 'Inter', fontSize: 15}}>{ pickPlayerbySeat((index) * 2 + 1)?.roundScore } : { pickPlayerbySeat((index) * 2 + 1)?.points }</Text>
                                    </View>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1}}>
                                        <Text style={{fontFamily: 'Inter', fontSize: 15, marginBottom: 5, marginLeft: 10}}>
                                        { pickPlayerbySeat((index) * 2 + 2)?.name }
                                        </Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <Text style={{fontFamily: 'Inter', fontSize: 15}}>{ pickPlayerbySeat((index) * 2 + 2)?.seat }</Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <Text style={{fontFamily: 'Inter', fontSize: 15}}>{ pickPlayerbySeat((index) * 2 + 2)?.roundScore } : { pickPlayerbySeat((index) * 2 + 2)?.points }</Text>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
                <NewRoundButton
                 title={roundButton}
                 onPress={handleNewRound} 
                 color={'rgb(100,170,256)'} 
                 pressColor={'rgb(150,150,256)'}
                 margin={10}></NewRoundButton>
            </LinearGradient>
        </SafeAreaView>
    );
};