import React from 'react';
import {Pressable, Text, Animated} from 'react-native';

const Button = ({ title, onPress , color, pressColor, margin}) => {
    
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
        outputRange: [color, pressColor]
    });

    return (
        <Pressable 
            onPressIn={handlePress}
            onPressOut={handleRelease}
            onPress={onPress}>
            <Animated.View 
                style={{alignItems: 'center', borderRadius: 20, marginHorizontal: 15, padding: 15, backgroundColor, margin: margin}}>
                <Text style={{color: 'black', fontFamily: 'InterBlack', fontSize: 30}}>{title}</Text>
            </Animated.View>
        </Pressable>
    );
};

export default Button;