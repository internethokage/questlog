import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

// Screens
import HabitsScreen from './src/screens/HabitsScreen';
import CharacterScreen from './src/screens/CharacterScreen';
import BattlesScreen from './src/screens/BattlesScreen';
import MapScreen from './src/screens/MapScreen';
import StatsScreen from './src/screens/StatsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopColor: '#2d4059',
          },
          tabBarActiveTintColor: '#ffd700',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tab.Screen 
          name="Habits" 
          component={HabitsScreen}
          options={{
            tabBarLabel: 'Habits',
            headerTitle: 'Today\'s Quests',
          }}
        />
        <Tab.Screen 
          name="Character" 
          component={CharacterScreen}
          options={{
            tabBarLabel: 'Warrior',
            headerTitle: 'Your Warrior',
          }}
        />
        <Tab.Screen 
          name="Battles" 
          component={BattlesScreen}
          options={{
            tabBarLabel: 'Battles',
            headerTitle: 'Battle Log',
          }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen}
          options={{
            tabBarLabel: 'Yggdrasil',
            headerTitle: 'The World Tree',
          }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{
            tabBarLabel: 'Stats',
            headerTitle: 'Progress',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
