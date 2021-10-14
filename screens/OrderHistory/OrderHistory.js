import React, {Component} from 'react';
import {
  itemsActions,
  cartActions,
  addressActions,
  userActions,
  orderActions,
} from './../../actions';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {Card, Paragraph, Button, Appbar, Text} from 'react-native-paper';
import * as RootNavigation from './../../RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckUserAccess from '../CheckUserAccess/CheckUserAccess';
import moment from 'moment';
import EmptyOrderHistory from './EmptyOrderHistory';
import {priceSymbolConstants} from '../../constants';
class OrderHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      data: [],
      customer_id: null,
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
      this.props.getOrders(userId);
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

  navigateToPayment(id, orderList, sub_total) {
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
    RootNavigation.navigate('Payment', {
      orderDetails: {id: id, sub_total: sub_total, price_symbol: symbol},
    });
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
    return symbol
  }

  navigateToFeedback(id) {
    RootNavigation.navigate('Feedback', {orderDetails: {id: id}});
  }

  navigateToTrack(orderDetails) {
    RootNavigation.navigate('Track', {orderDetails: orderDetails});
  }

  returnNameOfItem(item) {
    if (item) {
      let name = item[this.props.selectedLanguage].name;
      return name;
    } else {
      return '';
    }
  }

  render() {
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
      appHeaderTextStyle: {
        fontFamily: 'Poppins-Regular',
        lineHeight: 28
      },
      contactUsCardStyle: {
        backgroundColor: '#fcfcfc',
      },
      contactUsParagraphStyle: {
        fontSize: 12,
        color: 'gray',
        fontFamily: 'Poppins-Regular',
      },
      orderCardStyle: {
        marginTop: 10,
        marginHorizontal: 10,
        elevation: 1,
        borderRadius: 10,
      },
      orderCardContentStyle: {
        paddingTop: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingBottom: 10,
        marginBottom: 10,
      },
      orderCardContentParagraphStyle: {
        fontSize: 12,
        color: 'gray',
        fontFamily: 'Poppins-Regular',
      },
      orderCardContentViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 0,
        alignItems: 'center',
      },
      orderItemViewStyle: {
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'flex-start',
      },
      orderItemViewTextStyle: {
        fontSize: 14,
        color: '#424242',
        marginBottom: 2,
        fontFamily: 'Poppins-Regular',
      },
      orderItemPriceViewStyle: {
        flex: 0.3,
        alignItems: 'flex-end',
      },
      priceSymbolStyle: {
        color: 'gray',
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
      },
      priceTextStyle: {
        color: 'gray',
        fontFamily: 'Poppins-Regular',
      },
      subTotalCardContentStyle: {
        borderTopWidth: 1,
        borderColor: '#eee',
        marginTop: 10,
      },
      subTotalCardContentViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'center',
      },
      totalTextStyle: {
        fontSize: 16,
        color: '#424242',
        fontFamily: 'Poppins-SemiBold',
      },
    });

    return (
      <CheckUserAccess>
        <View style={styles.container}>
          <View>
            <Appbar.Header style={styles.appHeaderStyle}>
              <Appbar.Content
                title="My Order History"
                titleStyle={styles.appHeaderTextStyle}
              />
            </Appbar.Header>
          </View>

          {this.props.orderList?.length && this.props.orderList ? (
            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.isOrderListLoading}
                  onRefresh={this.onRefresh}
                />
              }>
              <Card>
                <Card.Content style={styles.contactUsCardStyle}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() =>
                      Linking.openURL(
                        `mailto:alakarte@customerHelpDesk.com?subject=Cancel the My Order&body=Hi Please cancel my order request`,
                      )
                    }>
                    <Paragraph style={styles.contactUsParagraphStyle}>
                      In case if you want to cancel your order please reach out
                      us using the mail id <Text>alakarte@support.com</Text>
                    </Paragraph>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
              {this.props.orderList?.map((ele, index) => {
                return (
                  <Card style={styles.orderCardStyle} key={index}>
                    <Card.Content style={styles.orderCardContentStyle}>
                      <Paragraph style={styles.orderCardContentParagraphStyle}>
                        ORDER ID: ALK-ORDER-ID-{ele.id}
                      </Paragraph>
                    </Card.Content>
                    <Card.Content>
                      {ele?.order_items?.map((el, ind) => {
                        return (
                          <View
                            key={ind}
                            style={styles.orderCardContentViewStyle}>
                            <View style={styles.orderItemViewStyle}>
                              <Text
                                style={styles.orderItemViewTextStyle}
                                numberOfLines={2}>
                                {ind + 1}.{' '}
                                {this.returnNameOfItem(
                                  this.props.itemList?.filter(
                                    item => item.id === el.product_id,
                                  )[0],
                                )}
                              </Text>
                            </View>

                            <View style={styles.orderItemPriceViewStyle}>
                              <Text style={styles.priceTextStyle}>
                                {el.quantity} x{' '}
                                <Text style={styles.priceSymbolStyle}>
                                  {
                                    priceSymbolConstants[
                                      this.props.itemList?.filter(
                                        item => item.id === el.product_id,
                                      )[0]?.country
                                    ]
                                  }{' '}
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
                    <Card.Content style={styles.subTotalCardContentStyle}>
                      <View style={styles.subTotalCardContentViewStyle}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={styles.totalTextStyle}
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
                              {this.returnPriceSymbol(ele)}
                            </Text>{' '}
                            {this.subTotal(ele)}
                          </Text>
                        </View>
                      </View>
                    </Card.Content>
                    <View style={{marginHorizontal: 15}}>
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
                          {moment(ele?.last_modified).format('DD-MM-YYYY')})
                        </Paragraph>
                        <Paragraph
                          style={{
                            fontSize: 16,
                            marginTop: 0,
                            color: '#26988A',
                            fontFamily: 'Poppins-SemiBold',
                          }}>
                          {ele?.order_status[0]?.status}{' '}
                          <Text
                            style={{
                              fontSize: 10,
                              marginTop: 0,
                              color: '#26988A',
                              fontFamily: 'Poppins-SemiBold',
                            }}>
                            {ele?.payment_image === null
                              ? '(Payment not done yet)'
                              : '(Bill uploaded)'}{' '}
                          </Text>
                        </Paragraph>
                      </View>
                    </View>
                    {ele?.order_status[0]?.status === 'PLACED' ? (
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          borderTopWidth: 1,
                          borderColor: '#eee',
                          marginTop: 10,
                        }}>
                        <View style={{flex: 1}}>
                          {ele?.payment_image === null ? (
                            <Button
                              mode="contained"
                              icon={
                                ele?.payment_image === null
                                  ? 'credit-card'
                                  : 'package'
                              }
                              style={{
                                elevation: 0,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                              }}
                              onPress={() =>
                                this.navigateToPayment(
                                  ele.id,
                                  ele,
                                  this.subTotal(ele),
                                )
                              }
                              labelStyle={{
                                fontSize: 12,
                                paddingVertical: 2,
                                fontFamily: 'Poppins-SemiBold',
                              }}>
                              MAKE PAYMENT
                            </Button>
                          ) : (
                            <Button
                              mode="contained"
                              icon={
                                ele?.payment_image === null
                                  ? 'credit-card'
                                  : 'package'
                              }
                              style={{
                                elevation: 0,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                              }}
                              onPress={() => this.navigateToTrack(ele)}
                              labelStyle={{
                                fontSize: 12,
                                paddingVertical: 2,
                                fontFamily: 'Poppins-SemiBold',
                              }}>
                              TRACK
                            </Button>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          borderTopWidth: 1,
                          borderColor: '#eee',
                          marginTop: 10,
                        }}>
                        <View>
                          <Button
                            mode="contained"
                            icon="star"
                            onPress={() => this.navigateToFeedback(ele.id)}
                            style={{
                              elevation: 0,
                              borderBottomRightRadius: 10,
                              borderBottomLeftRadius: 10,
                            }}
                            labelStyle={{
                              fontSize: 12,
                              paddingVertical: 2,
                              fontWeight: 'bold',
                            }}>
                            GIVE FEEDBACK
                          </Button>
                        </View>
                      </View>
                    )}
                  </Card>
                );
              })}

              <View style={{height: 500}}></View>
            </ScrollView>
          ) : (
            <View>
              {this.props.isOrderListLoading && this.props.orderList ? (
                <View></View>
              ) : (
                <EmptyOrderHistory></EmptyOrderHistory>
              )}
            </View>
          )}
        </View>
      </CheckUserAccess>
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
const connectedApp = connect(mapState, actionCreators)(OrderHistory);
export {connectedApp as OrderHistory};
