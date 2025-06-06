import React, { useEffect } from 'react';
import { Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, interpolate } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native'; // <-- Add this import
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  DrawScreen: undefined;
  AvatarScreen: undefined;}

import ParallaxScrollView from '../app-example/components/ParallaxScrollView';
import { ThemedText } from '../app-example/components/ThemedText';
import { ThemedView } from '../app-example/components/ThemedView';

export default function HomeScreen() {
  console.log('HomeScreen render');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>(); // <-- Typed navigation

  //const navigation = useNavigation(); // <-- Add this line

  const offsetY = useSharedValue(-100); // Start off-screen
  const buttonScale1 = useSharedValue(1);
  const buttonScale2 = useSharedValue(1);

  useEffect(() => {
    offsetY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) });
  }, []);

  const animatedHeaderImageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offsetY.value, [0, 100], [0.5, 1]),
  }));

  const animatedButton1Style = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale1.value }],
  }));

  const animatedButton2Style = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale2.value }],
  }));

  const handleButtonPressIn = (sharedValue: Animated.SharedValue<number>) => {
    sharedValue.value = withTiming(0.95, { duration: 100 });
  };

  const handleButtonPressOut = (sharedValue: Animated.SharedValue<number>) => {
    sharedValue.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E6F0FA', dark: '#2B3A55' }}
      headerImage={
        <Animated.View style={animatedHeaderImageStyle}>
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        </Animated.View>
      }
    >
      <ThemedView style={styles.centeredContainer}>
        <ThemedText type="subtitle" style={[styles.centeredText, { color: '#BFD7ED' }]}>
          “Recovery is not about changing who you are; it's about letting go of who you are not.”
        </ThemedText>
        <ThemedText style={{ fontStyle: 'italic', marginTop: 8, textAlign: 'center', color: '#BFD7ED' }}>
          - Dr. Anita Johnston Press
        </ThemedText>
        <Animated.View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#BFD7ED' }, animatedButton1Style]}
            onPress={() => {
              console.log('Botón DrawScreen pulsado');
              navigation.navigate('DrawScreen')}} // <-- Navigate to DrawScreen
          >
            <Text style={[styles.buttonText, { color: '#1E3D59' }]}>✏️ Draw from Scratch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#D6EAF8' }, animatedButton2Style]}
            onPress={() => {
              console.log('Botón AvatarScreen pulsado');
              navigation.navigate('AvatarScreen')}} // <-- Navigate to AvatarScreen
          >
            <Text style={[styles.buttonText, { color: '#2C3E50' }]}>🧍 Start with Existing Avatars</Text>
          </TouchableOpacity>
        </Animated.View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 20,
  },
  centeredText: {
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});