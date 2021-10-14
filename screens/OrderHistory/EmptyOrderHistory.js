import React, {Component} from 'react';
import {Text, View, Dimensions} from 'react-native';
import {Button} from 'react-native-paper';
import * as RootNavigation from './../../RootNavigation';

const height = Dimensions.get('window').height - 100;
export default class EmptyOrderHistory extends Component {
  render() {
    return (
      <View
        style={{
          display: 'flex',
          height: height,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <View>
          <Text
            style={{
              fontSize: 26,
              color: '#3A3A3A',
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
            }}>
            {' '}
            Your Order History
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#a9a9a9',
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
            }}>
            {' '}
            currently empty. Awaits your next order{' '}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Button
              mode="contained"
              onPress={() => RootNavigation.navigate('Browser')}
              style={{borderRadius: 20, marginTop: 15}}
              labelStyle={{fontFamily: 'Poppins-SemiBold', lineHeight: 18}}>
              Continue Viewing product
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
