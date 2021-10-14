import React, {Component} from 'react';
import {itemsActions, cartActions} from './../../actions';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  IconButton,
  Button,
  Appbar,
  Text,
} from 'react-native-paper';
import * as RootNavigation from './../../RootNavigation';
import {priceSymbolConstants} from '../../constants';
import EmptyCart from './EmptyCart';
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {}

  navigateTo = () => {
    RootNavigation.navigate('Browser');
  };

  navigateToAddress = () => {
    RootNavigation.navigate('Order');
  };

  addItemToCart(item) {
    this.props.addItemToUserCart(item);
  }
  increaseOrderQuantity(id) {
    this.props.increaseOrderQuantity(id);
  }

  decreaseOrderQuantity(id, currentQuantity) {
    if (currentQuantity === 1 || currentQuantity === '1') {
      this.props.removeItemFromCart(id);
    } else {
      this.props.decreaseOrderQuantity(id);
    }
  }

  totalAmount() {
    if (this.props.cartList.length > 0) {
      let price = this.props.cartList.map(ele => ele.price * ele.orderQuantity);
      let sub_total = price.reduce((x, y) => x + y, 0);
      return parseInt(sub_total);
    } else {
      return 0;
    }
  }

  returnPriceSymbol() {
    if (this.props.cartList.length > 0) {
      let country = this.props.cartList[0]?.country;
      let symbol = priceSymbolConstants[country]
        ? priceSymbolConstants[country]
        : '';
      return symbol;
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
        marginTop: 10,
        marginHorizontal: 10,
        elevation: 2,
        borderRadius: 5,
      },
      productTitleText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#424242',
        marginTop: -10,
        lineHeight: 20,
        marginTop: 2,
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
        color: '#382c1d',
        elevation: 2,
      },
      appHeaderTitleStyle: {
        fontFamily: 'Poppins-Regular',
        lineHeight: 28
      },
      totalPriceCardStyle: {
        marginTop: 10,
        marginHorizontal: 10,
        elevation: 2,
        borderRadius: 5,
      },
      totalPriceCardViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      totalPriceTextStyle: {
        fontSize: 20,
        color: '#26988A',
        fontFamily: 'Poppins-SemiBold',
        lineHeight: 35
      },
      priceSymbolStyle: {
        fontSize: 14,
        color: '#26988A',
        fontFamily: 'Poppins-SemiBold',
      },
      totalAmountTextStyle: {
        fontSize: 12,
        color: 'gray',
        fontFamily: 'Poppins-Regular',
      },
      continueButtonStyle: {
        elevation: 3,
        borderRadius: 2,
        borderRadius: 20,
        alignContent: 'flex-end',
      },
      continueButtonTextStyle: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        lineHeight: 20
      },
      orderSummeryTextStyle: {
        color: '#3A3A3A',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        marginHorizontal: 15,
        marginBottom: 0,
        marginTop: 15,
        lineHeight: 20
      },
      removeButtonStyle: {
        elevation: 0,
        backgroundColor: '#26988A',
        position: 'absolute',
        right: 0,
        zIndex: 999,
        top: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      productImageStyle: {
        height: 100,
        width: 100,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        marginTop: 20,
      },
      productImageViewStyle: {
        flex: 0.3,
        paddingLeft: 10,
        borderRadius: 10,
        alignItems: 'flex-end',
      },
      textInputStyle: {
        textAlign: 'center',
        height: 28,
        width: 70,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#eee',
        paddingVertical: 0,
        color: "#424242"
      },
      productPriceTextStyle: {
        fontSize: 14,
        color: '#26988A',
        fontFamily: 'Poppins-SemiBold',
      },
      productPriceSymbolTextStyle: {
        fontSize: 10,
        color: '#26988A',
        fontFamily: 'Poppins-SemiBold',
      },
      productCardParagraphStyle: {
        fontSize: 12,
        marginTop: 0,
        color: 'gray',
      },
      plusMinusButtonViewStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5,
      },
    });

    return (
      <>
        <SafeAreaView style={styles.container}>
          <View>
            <Appbar.Header style={styles.appHeaderStyle}>
              <Appbar.Content
                title="Products in my cart"
                titleStyle={styles.appHeaderTitleStyle}
              />
            </Appbar.Header>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            {this.props.cartList?.length ? (
              <View>
                <Card style={styles.totalPriceCardStyle}>
                  <Card.Content>
                    <View style={styles.totalPriceCardViewStyle}>
                      <View>
                        <Text style={styles.totalPriceTextStyle}>
                          <Text style={styles.priceSymbolStyle}>
                            {this.returnPriceSymbol()}
                          </Text>{' '}
                          {this.totalAmount()}
                        </Text>
                        <Text style={styles.totalAmountTextStyle}>
                          Your total amount
                        </Text>
                      </View>

                      <View>
                        <Button
                          mode="contained"
                          onPress={() => this.navigateToAddress()}
                          style={styles.continueButtonStyle}
                          labelStyle={styles.continueButtonTextStyle}>
                          Continue
                        </Button>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
                <Text style={styles.orderSummeryTextStyle}>Order Summary</Text>
                {this.props.cartList?.map((ele, index) => {
                  return (
                    <Card key={index} style={styles.productCard}>
                      <Card.Content>
                        <IconButton
                          icon="close"
                          color={'#fff'}
                          size={15}
                          onPress={() => this.props.removeItemFromCart(ele.id)}
                          style={styles.removeButtonStyle}
                        />

                        <View style={{display: 'flex', flexDirection: 'row'}}>
                          <View style={{flex: 0.7}}>
                            <View>
                              <Title style={styles.productTitleText}>
                                {ele[this.props.selectedLanguage]?.name}
                              </Title>

                              <Text style={styles.productPriceTextStyle}>
                                <Text
                                  style={styles.productPriceSymbolTextStyle}>
                                  {priceSymbolConstants[ele.country]
                                    ? priceSymbolConstants[ele.country]
                                    : ''}{' '}
                                </Text>
                                {ele?.price}{' '}
                              </Text>
                              <Paragraph
                                style={styles.productCardParagraphStyle}>
                                Your product will be deliver with in 2 days from
                                the order confirmation
                              </Paragraph>
                              <View style={styles.plusMinusButtonViewStyle}>
                                <View>
                                  <IconButton
                                    icon="minus"
                                    color={'#fff'}
                                    size={15}
                                    style={{
                                      backgroundColor: '#26988A',
                                      marginLeft: 0,
                                    }}
                                    onPress={() =>
                                      this.decreaseOrderQuantity(
                                        ele.id,
                                        ele.orderQuantity,
                                      )
                                    }
                                  />
                                </View>

                                <TextInput
                                  style={styles.textInputStyle}
                                  keyboardType="numeric"
                                  value={ele.orderQuantity + ''}
                                  onChangeText={text =>
                                    this.props.setQuantity(ele.id, text)
                                  }
                                />

                                <View>
                                  <IconButton
                                    icon="plus"
                                    color={'#fff'}
                                    style={{backgroundColor: '#26988A'}}
                                    size={15}
                                    onPress={() =>
                                      this.increaseOrderQuantity(ele.id)
                                    }
                                  />
                                </View>
                              </View>
                            </View>
                          </View>

                          <View style={styles.productImageViewStyle}>
                            <Image
                              source={{
                                uri: ele?.product_attachments[0]
                                  ?.attachment_url,
                              }}
                              resizeMode="cover"
                              style={styles.productImageStyle}
                            />
                          </View>
                        </View>
                      </Card.Content>
                    </Card>
                  );
                })}

                <View style={{height: 300}}></View>
              </View>
            ) : (
              <View>
                <EmptyCart {...this.props}></EmptyCart>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

function mapState(state) {
  const {appLanguage, cart} = state;
  const {cartList} = cart;
  const {selectedLanguage} = appLanguage;
  return {
    selectedLanguage,
    cartList,
  };
}

const actionCreators = {
  getItems: itemsActions.getItems,
  addItemToUserCart: cartActions.addItemToUserCart,
  increaseOrderQuantity: cartActions.increaseOrderQuantity,
  decreaseOrderQuantity: cartActions.decreaseOrderQuantity,
  removeItemFromCart: cartActions.removeItemFromCart,
  setQuantity: cartActions.setQuantity,
};
const connectedApp = connect(mapState, actionCreators)(Cart);
export {connectedApp as Cart};
