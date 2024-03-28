import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Start from '../../fitness-tracker/src/screens/Start';
import Home from '../../fitness-tracker/src/screens/Home';
import Login from '../../fitness-tracker/src/screens/Login';
import Signup from '../../fitness-tracker/src/screens/Signup';

const Stack = createStackNavigator();

/*
This is the stack navigator. The Stack.Navigator must be wrapped in a NavigationContainer
Within Stack.Navigator you can specify screens in the following format:
  <Stack.Screen name="insert_screen_name_here" component={insert_component_name_here} />

Each screen has a header which can be turned off by adding the following property to a Stack.Screen tag:
  options={{ headerShown: false }}

To naviagte between screens the screen must accept props (See beginning of Home.js)
Then call the function: props.navigation.navigate('insert_screen_name_here')

If you don't want the user to be able to navigate back to the previous page via swiping back,
call the following function instead: props.navigation.replace('insert_screen_name_here')

To go back to the previous screen there's also: props.navigation.goBack()

There's a few other methods but these are the 2 we're probably gonna need the most
*/
function NavigatorStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator /*initialRouteName="Home" */>
        <Stack.Screen name="Start" component={Start}/>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default NavigatorStack;