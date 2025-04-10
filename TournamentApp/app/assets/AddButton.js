import React from 'react';
import {Pressable, StyleSheet, Text, View, Animated, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Button = ({ onPress }) => {
    
    //Animated Value
    const backgroundColorRef = new Animated.Value(0);

    //Handles the Button Press
    const handlePress = () => {
        Animated.timing(backgroundColorRef, {
            toValue: 1,
            duration: 60,
            useNativeDriver: true
        }).start();
    };
    //Handles the Button Release
    const handleRelease = () => {
        Animated.timing(backgroundColorRef, {
            toValue: 0,
            duration: 60,
            useNativeDriver: true
        }).start();
    }

    const backgroundColor = backgroundColorRef.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(176, 176, 176, 0.72)', 'rgba(176, 176, 176, 0.9)']
    });


    return (
        <Pressable 
            onPressIn={handlePress}
            onPressOut={handleRelease}
            onPress={onPress}>
            <Animated.View style={{alignItems: 'center', justifyContent: 'center', borderRadius: 40, backgroundColor, height: 47, width: 47}}>
                <SafeAreaView style={{backgroundColor: 'rgba(0, 0, 0, 1)', width: 30, height: 5, borderRadius: 5, marginTop: 12.5}}/>
                <SafeAreaView style={{backgroundColor: 'rgba(0, 0, 0, 1)', width: 5, height: 30, borderRadius: 5, marginTop: -17.5}}/>
            </Animated.View>
        </Pressable>
    );
};

export default Button;