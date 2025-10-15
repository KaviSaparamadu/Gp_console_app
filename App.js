import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import Splash from "./src/screen/splash";
import Login from "./src/screen/login";
import Home from "./src/screen/Home/home";
import Front from "./src/screen/frontpage/front";
import HumanResource from './src/screen/Human/humanDashboard';
import Human from './src/screen/Human/human-management';
import Employee from './src/screen/Human/employee-management';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={Splash} /> 
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Front" component={Front} />
        <Stack.Screen name="HumanResource" component={HumanResource} />
        <Stack.Screen name="Human" component={Human}/>
        <Stack.Screen name="Employee" component={Employee} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
