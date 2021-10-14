import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from "./../screens/Home/Home";
import { Cart } from "../screens/Cart/Cart";
import { OrderHistory } from "../screens/OrderHistory/OrderHistory";
import { Profile } from "../screens/Profile/Profile";

const Tab = createBottomTabNavigator();

const Tabbar = (props) => {
    return (
        <Tab.Navigator
            tabBarOptions = {{
                activeTintColor: "#fff",
                inactiveTintColor: "rgba(255,255,255,0.6)",
                style: { position: 'absolute', marginBottom: 10, height: 55, marginHorizontal: 10, backgroundColor: "#26988A", borderRadius: 30, elevation: 5},
                labelStyle: { fontSize: 12}
            }}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Home') {
                        return (
                            <Image
                                style={{ width: 20, height: 20, tintColor: color }}
                                source={require('../assets/icons/home.png')}
                            />
                        );
                    }
                    if (route.name === 'Cart') {
                        return (
                            <Image
                                style={{ width: 20, height: 20, tintColor: color }}
                                source={require('../assets/icons/cart.png')}
                            />
                        );
                    }
                    if (route.name === 'Order History') {
                        return (
                            <Image
                                style={{ width: 20, height: 20, tintColor: color }}
                                source={require('../assets/icons/orders.png')}
                            />
                        );
                    }
                    if (route.name === 'Profile') {
                        return (
                            <Image
                                style={{ width: 20, height: 20, tintColor: color }}
                                source={require('../assets/icons/profile.png')}
                            />
                        );
                    }
                },
            })}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Cart" component={Cart} />
            <Tab.Screen name="Order History" component={OrderHistory} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    )
}

export default Tabbar;