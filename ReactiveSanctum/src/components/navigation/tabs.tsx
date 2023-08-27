import React from 'react';

import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
import { ReleasesCore } from '../../pages/releases';
import { GamesList } from '../../pages/gamesList';

const Tab = createBottomTabNavigator();

var tabBar: ((props: BottomTabBarProps) => React.ReactNode) = ({ navigation, state, descriptors, insets }) => (
    <BottomNavigation.Bar
      navigationState={state}
     safeAreaInsets={insets}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
         navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];
        if (options.tabBarIcon) {
          return options.tabBarIcon({ focused, color, size: 24 });
        }

        return null;
      }}
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key];
        const label: string = options.tabBarLabel as string;

        return label;
      }}
    />
  );

function getReleasesIcon(props: { focused: boolean, color: string, size: number}){
    return <Ionicons name="calendar-outline" size={props.size} color={props.color} />;
}

function getGamesIcon(props: { focused: boolean, color: string, size: number}){
    return <Ionicons name="game-controller-outline" size={props.size} color={props.color} />;
}

export function NavigationTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={tabBar}
    >
      <Tab.Screen
        name="Releases"
        component={ReleasesCore}
        options={{
          tabBarLabel: 'Releases',
          tabBarIcon: getReleasesIcon,
        }}
      />
      <Tab.Screen
        name="Games"
        component={GamesList}
        options={{
          tabBarLabel: 'Games',
          tabBarIcon: getGamesIcon,
        }}
      />
    </Tab.Navigator>
  );
}
