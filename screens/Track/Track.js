import React, {Component} from 'react';
import {
  itemsActions,
  cartActions,
  addressActions,
  userActions,
  orderActions,
} from './../../actions';
import {connect} from 'react-redux';
import {View, StyleSheet, StatusBar} from 'react-native';
import {Card, Paragraph, Appbar, Text} from 'react-native-paper';
import * as RootNavigation from './../../RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckUserAccess from '../CheckUserAccess/CheckUserAccess';
import {priceSymbolConstants} from '../../constants';
import moment from 'moment';

class Track extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      data: [],
      customer_id: null,
      data: [
        {time: '09:00', title: 'Event 1', description: 'Event 1 Description'},
        {time: '10:45', title: 'Event 2', description: 'Event 2 Description'},
        {time: '12:00', title: 'Event 3', description: 'Event 3 Description'},
        {time: '14:00', title: 'Event 4', description: 'Event 4 Description'},
        {time: '16:30', title: 'Event 5', description: 'Event 5 Description'},
      ],
    };
  }

  async componentDidMount() {
    let user = await AsyncStorage.getItem('user');
    let userObj = JSON.parse(user);
    let userId = userObj?.id;
    if (userId) {
      this.setState({
        customer_id: userId,
      });
      this.props.getUserDetails(userId);
    }
  }

  navigateTo = () => {
    RootNavigation.navigate('Browser');
  };

  onRefresh = () => {
    this.props.getOrders(this.state.customer_id);
  };

  subTotal(orderItems) {
    let item = orderItems?.order_items?.map(el => {
      return {
        ...el,
        price: this.props.itemList?.filter(
          item => item?.id === el?.product_id,
        )[0]?.price,
      };
    });
    let price = item?.map(ele => ele.price * ele.quantity);
    let sub_total = price.reduce((a, b) => a + b, 0);
    if (price) {
      return sub_total;
    } else {
      return 0;
    }
  }

  navigateToPayment(id, sub_total) {
    RootNavigation.navigate('Payment', {
      orderDetails: {id: id, sub_total: sub_total},
    });
  }

  navigateToFeedback(id) {
    RootNavigation.navigate('Feedback', {orderDetails: {id: id}});
  }

  navigateToTrack(orderDetails) {
    RootNavigation.navigate('Track', {orderDetails: orderDetails});
  }

  navigateTo() {
    RootNavigation.navigate('Browser');
  }

  returnNameOfItem(item) {
    if (item) {
      let name = item[this.props.selectedLanguage].name;
      return name;
    } else {
      return '';
    }
  }

  returnPriceSymbol(orderList) {
    let item = orderList?.order_items?.map(el => {
      return {
        ...el,
        country: this.props.itemList?.filter(
          item => item?.id === el?.product_id,
        )[0]?.country,
      };
    });
    let country = item[0]?.country;
    let symbol = priceSymbolConstants[country]
      ? priceSymbolConstants[country]
      : '';
    return symbol;
  }

  render() {
    const orderDetails = this.props.route.params.orderDetails;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        position: 'relative',
        paddingTop: StatusBar.currentHeight,
      },
      content: {
        padding: 0,
      },
      imageHeight: {
        height: 350,
      },

      productCard: {
        marginBottom: 1,
        elevation: 0,
        backgroundColor: '#fff',
      },
      productTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 20,
        paddingTop: 10,
        color: '#424242',
      },
      productAboutText: {
        fontSize: 17,
        lineHeight: 20,
        paddingTop: 10,
        color: '#382c1d',
        marginBottom: 20,
      },
      appHeaderStyle: {
        backgroundColor: '#fff',
        color: '#424242',
        elevation: 1,
      },
    });

    return (
      <>
        <CheckUserAccess>
          <View style={styles.container}>
            <View>
              <Appbar.Header style={styles.appHeaderStyle}>
                <Appbar.BackAction
                  onPress={() => {
                    this.navigateTo();
                  }}
                  style={{marginTop: 10, backgroundColor: '#fff'}}
                />
                <Appbar.Content
                  title="Tracking Details"
                  style={{marginLeft: -13}}
                  titleStyle={{fontFamily: 'Poppins-Regular', lineHeight: 28}}
                />
              </Appbar.Header>
            </View>

            <View>
              <Card
                style={{
                  marginTop: 10,
                  marginHorizontal: 10,
                  elevation: 2,
                  borderRadius: 10,
                }}>
                <Card.Content
                  style={{
                    paddingTop: 10,
                    borderBottomWidth: 1,
                    borderColor: '#eee',
                    paddingBottom: 10,
                    marginBottom: 10,
                  }}>
                  <Paragraph
                    style={{
                      fontSize: 12,
                      color: 'gray',
                      fontFamily: 'Poppins-Regular',
                    }}>
                    ORDER ID: ALK-ORDER-ID-{orderDetails.id}
                  </Paragraph>
                </Card.Content>
                <Card.Content>
                  {orderDetails?.order_items?.map((el, ind) => {
                    return (
                      <View
                        key={ind}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 0,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flex: 0.7,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#424242',
                              marginBottom: 2,
                              fontFamily: 'Poppins-Regular',
                            }}
                            numberOfLines={2}>
                            {ind + 1}.{' '}
                            {this.returnNameOfItem(
                              this.props.itemList?.filter(
                                item => item.id === el.product_id,
                              )[0],
                            )}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 0.3,
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: 'gray',
                              fontFamily: 'Poppins-Regular',
                            }}>
                            {el.quantity} x{' '}
                            <Text style={{color: 'gray', fontSize: 10}}>
                              ₱{' '}
                            </Text>
                            {
                              this.props.itemList?.filter(
                                item => item.id === el.product_id,
                              )[0]?.price
                            }
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </Card.Content>
                <Card.Content
                  style={{
                    borderTopWidth: 1,
                    borderColor: '#eee',
                    marginTop: 10,
                    backgroundColor: '#fdfdfd',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 5,
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Poppins-SemiBold',
                          color: '#424242',
                        }}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}>
                        Total
                      </Text>
                    </View>

                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#26988A',
                          fontSize: 16,
                          fontFamily: 'Poppins-SemiBold',
                        }}>
                        {' '}
                        <Text
                          style={{
                            color: '#26988A',
                            fontSize: 12,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {this.returnPriceSymbol(orderDetails)}
                        </Text>{' '}
                        {this.subTotal(orderDetails)}
                      </Text>
                    </View>
                  </View>
                  <View style={{marginHorizontal: 0}}>
                    <View
                      style={{
                        borderRadius: 1,
                        marginTop: 0,
                      }}>
                      <Paragraph
                        style={{
                          fontSize: 12,
                          marginTop: 0,
                          color: 'gray',
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Currently your order details (
                        {moment(orderDetails?.last_modified).format(
                          'DD-MM-YYYY',
                        )}
                        )
                      </Paragraph>
                      <Paragraph
                        style={{
                          fontSize: 16,
                          marginTop: 0,
                          color: '#26988A',
                          fontFamily: 'Poppins-SemiBold',
                        }}>
                        {orderDetails?.order_status[0]?.status}{' '}
                        <Text
                          style={{
                            fontSize: 10,
                            marginTop: 0,
                            color: '#26988A',
                            fontFamily: 'Poppins-SemiBold',
                          }}>
                          {orderDetails?.payment_image === null
                            ? '(Payment not done yet)'
                            : '(Bill uploaded)'}{' '}
                        </Text>
                      </Paragraph>
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {orderDetails?.order_status?.map((ele, index) => {
                return (
                  <Card
                    style={{
                      marginTop: 10,
                      marginHorizontal: 10,
                      elevation: 2,
                      borderRadius: 10,
                    }}
                    key={index}>
                    <Card.Content
                      style={{
                        paddingTop: 10,
                        borderBottomWidth: 1,
                        borderColor: '#eee',
                        paddingBottom: 10,
                        marginBottom: 10,
                      }}>
                      <Paragraph
                        style={{
                          fontSize: 12,
                          color: 'gray',
                          fontFamily: 'Poppins-SemiBold',
                        }}>
                        {moment(ele?.last_modified).format('DD-MM-YYYY')}
                      </Paragraph>
                    </Card.Content>
                    <Card.Content>
                      <View
                        style={{
                          borderRadius: 1,
                          marginTop: 0,
                        }}>
                           <Paragraph
                        style={{
                          fontSize: 12,
                          marginTop: 0,
                          color: 'gray',
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Status
                      </Paragraph>
                        <Paragraph
                          style={{
                            fontSize: 16,
                            marginTop: 0,
                            color: '#26988A',
                            fontFamily: 'Poppins-SemiBold',
                            lineHeight: 20
                          }}>
                          {ele?.status}{' '}
                        </Paragraph>
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}

              <View style={{height: 500}}></View>
            </View>
          </View>
        </CheckUserAccess>
      </>
    );
  }
}

function mapState(state) {
  const {appLanguage, cart, address, user, order, items} = state;
  const {userDetails, isRegistering, userRegistered} = user;
  const {isLoadingItems, itemList} = items;
  const {
    orderList,
    isOrderListLoading,
    orderListLoaded,
    isOrdering,
    orderingSuccessful,
    specialInstruction,
  } = order;
  const {cartList} = cart;
  const {
    addressList,
    isLoadingAddress,
    isAddingAddress,
    addressAdded,
    selectedAddress,
    isDeletingAddress,
  } = address;
  const {selectedLanguage} = appLanguage;
  return {
    selectedLanguage,
    cartList,
    addressList,
    isLoadingAddress,
    isAddingAddress,
    addressAdded,
    selectedAddress,
    isDeletingAddress,
    userDetails,
    isRegistering,
    userRegistered,
    orderList,
    isOrderListLoading,
    orderListLoaded,
    isOrdering,
    orderingSuccessful,
    specialInstruction,
    isLoadingItems,
    itemList,
  };
}

const actionCreators = {
  getItems: itemsActions.getItems,
  addItemToUserCart: cartActions.addItemToUserCart,
  increaseOrderQuantity: cartActions.increaseOrderQuantity,
  decreaseOrderQuantity: cartActions.decreaseOrderQuantity,
  removeItemFromCart: cartActions.removeItemFromCart,
  addAddress: addressActions.addAddress,
  setAddress: addressActions.setAddress,
  getAddress: addressActions.getAddress,
  deleteAddress: addressActions.deleteAddress,
  getUserDetails: userActions.getUserDetails,
  getOrders: orderActions.getOrders,
};
const connectedApp = connect(mapState, actionCreators)(Track);
export {connectedApp as Track};
