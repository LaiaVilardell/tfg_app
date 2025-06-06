import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/index';

function DrawScreen() {
  return (
    <View style={[styles.centered, { backgroundColor: '#fff', flex: 1 }]}>
      <Text style={styles.drawText}>Let's start drawing!</Text>
    </View>
  );
}

function AvatarScreen() {
  return (
    <View style={[styles.centered, { backgroundColor: '#000', flex: 1 }]}>
      <Text style={styles.avatarText}>Start your selection!</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DrawScreen" component={DrawScreen} />
        <Stack.Screen name="AvatarScreen" component={AvatarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  drawText: {
    fontSize: 28,
    color: '#222',
    fontWeight: 'bold',
  },
  avatarText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});