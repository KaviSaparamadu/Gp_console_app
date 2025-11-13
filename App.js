import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { store } from "./src/redux/store"; 

// Screens
import Splash from "./src/screen/splash";
import Login from "./src/screen/login";
import Home from "./src/screen/Home/home";
import HumanResource from './src/screen/Human/humanDashboard';
import Human from './src/screen/Human/human-management';
import Employee from './src/screen/Human/employee-management';
import SystemAdmin from './src/screen/SystemAdmin/systemDashboard';
import SystemSetting from './src/screen/SystemAdmin/SystemSetting/SystemSettingDashboard';
import EmployeeSetting from './src/screen/SystemAdmin/SystemSetting/employeeSetting';
import PersonalInfoScreen from './src/screen/profile/profileinfo';
import Settings from './src/screen/profile/setting';
import SecurityScreen from './src/screen/profile/security';
import VerifyNumber from './src/screen/otp';
import PhoneNumScreen from './src/screen/phoneNum';
import Dashboard from './src/screen/frontpage/front';
import Register from './src/screen/register';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}> 
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Splash" 
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} /> 
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="maindashboard" component={Dashboard} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="HumanResource" component={HumanResource} />
          <Stack.Screen name="Human" component={Human}/>
          <Stack.Screen name="Employee" component={Employee} />
          <Stack.Screen name="SystemAdmin" component={SystemAdmin} />
          <Stack.Screen name="SystemSetting" component={SystemSetting} />
          <Stack.Screen name="EmployeeSetting" component={EmployeeSetting} />
          <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
          <Stack.Screen name="VerifyNumber" component={VerifyNumber} />
          <Stack.Screen name="PhoneNumScreen" component={PhoneNumScreen} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
