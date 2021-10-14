import React, {Component} from 'react';
import {itemsActions, cartActions} from './../../actions';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  IconButton,
  Button,
  Snackbar,
} from 'react-native-paper';
import * as RootNavigation from './../../RootNavigation';
import ImageSlider from './../ImageSlider/ImageSlider';
import ImageView from 'react-native-image-viewing';
import {priceSymbolConstants} from '../../constants';

class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isSnackbarVisible: false,
    };
  }

  componentDidMount() {}
  componentDidUpdate(prevProps) {
    if (prevProps.cartList !== this.props.cartList) {
      if (prevProps.cartList?.length < this.props.cartList?.length) {
        this.setState({
          isSnackbarVisible: true,
        });
      }
    }
  }

  navigateTo = () => {
    RootNavigation.navigate('Browser');
  };

  navigateToCart = () => {
    RootNavigation.navigate('Cart');
  };

  addItemToCart(item) {
    this.props.addItemToUserCart(item);
  }
  increaseOrderQuantity(id) {
    this.props.increaseOrderQuantity(id);
  }

  decreaseOrderQuantity(id) {
    let orderQuantity = this.props.cartList.filter(
      el => el.id === this.props.route.params.item?.id,
    )[0].orderQuantity;
    if (orderQuantity === 1 || orderQuantity === '1') {
      this.props.removeItemFromCart(id);
    } else {
      this.props.decreaseOrderQuantity(id);
    }
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff',
        position: 'relative',
        paddingTop: StatusBar.currentHeight,
      },
      inverted: {
        transform: [{scaleY: -1}],
      },
      content: {
        padding: 0,
      },

      productTitleText: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        lineHeight: 20,
        paddingTop: 10,
        color: '#424242',
        marginLeft: -1,
      },
      productAboutText: {
        fontSize: 16,
        lineHeight: 20,
        paddingTop: 10,
        color: '#382c1d',
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
      },
      appHeaderStyle: {
        backgroundColor: '#fff',
        color: '#424242',
        elevation: 1,
      },
      backButtonStyle: {
        elevation: 2,
        position: 'absolute',
        left: 8,
        top: StatusBar.currentHeight + 5,
        backgroundColor: '#fff',
        zIndex: 9999,
      },
      fullScreenIconStyle: {
        elevation: 5,
        position: 'absolute',
        right: 10,
        bottom: 10,
        backgroundColor: '#fff',
      },
      cardContentStyle: {
        backgroundColor: '#fff',
        paddingTop: 5,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
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
      subDescriptionTextStyle: {
        color: 'gray',
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
      },
      snackbarStyle: {
        marginBottom: 80,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
      buttonViewStyle: {
        display: 'flex',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#eee',
        elevation: 5,
      },
      buttonTextStyle: {
        fontSize: 14,
        paddingVertical: 8,
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
      },
      productPriceViewStyle: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
      },
      priceViewStyle: {
        flex: 0.5,
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      priceTextStyle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        borderRadius: 3,
        color: '#26988A',
      },
      priceSymbolStyle: {
        fontSize: 14,
      },
      plusMinusButtonViewStyle: {
        marginTop: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    });

    const item = this.props.route.params.item;
    const itemDetails = item[this.props.selectedLanguage];
    const images = item?.product_attachments?.map(ele => ele?.attachment_url);
    const priceSymbol = priceSymbolConstants[item?.country];

    return (
      <>
        <View style={styles.container}>
          <IconButton
            icon="keyboard-backspace"
            color={'#424242'}
            size={25}
            onPress={() => this.navigateTo()}
            style={styles.backButtonStyle}
          />
          <ImageView
            images={images.map(ele => {
              return {
                uri: ele,
              };
            })}
            imageIndex={0}
            visible={this.state.visible}
            onRequestClose={() => this.setState({visible: false})}
          />
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            <View>
              <Card style={styles.productCard}>
                <View style={{position: 'relative'}}>
                  <ImageSlider images={images}></ImageSlider>
                  <IconButton
                    icon="fullscreen"
                    color={'#424242'}
                    size={25}
                    onPress={() => this.setState({visible: true})}
                    style={styles.fullScreenIconStyle}
                  />
                </View>

                <Card.Content style={styles.cardContentStyle}>
                  <Title style={styles.productTitleText}>
                    {itemDetails?.name}
                  </Title>
                  <View style={styles.infoContainerStyle}>
                    <Text style={styles.subDescriptionTextStyle}>
                      {itemDetails?.sub_description}
                    </Text>
                  </View>
                  <View style={styles.productPriceViewStyle}>
                    <View style={styles.priceViewStyle}>
                      <Text style={styles.priceTextStyle}>
                        <Text style={styles.priceSymbolStyle}>
                          {priceSymbol ? priceSymbol : ''}
                        </Text>{' '}
                        {item?.price} /-
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.5,
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}>
                      {this.props.cartList?.filter(el => el?.id === item?.id)
                        ?.length === 0 ? (
                        <View></View>
                      ) : (
                        <View>
                          <View style={styles.plusMinusButtonViewStyle}>
                            <View style={styles.viewStyle}>
                              <View>
                                <IconButton
                                  icon="minus"
                                  color={'#fff'}
                                  size={15}
                                  style={{backgroundColor: '#26988A'}}
                                  onPress={() =>
                                    this.decreaseOrderQuantity(item.id)
                                  }
                                />
                              </View>

                              <TextInput
                                style={styles.textInputStyle}
                                keyboardType="numeric"
                                value={
                                  this.props.cartList?.filter(
                                    el => el?.id === item?.id,
                                  )[0].orderQuantity + ''
                                }
                                onChangeText={text =>
                                  this.props.setQuantity(item.id, text)
                                }
                              />
                              <View>
                                <IconButton
                                  icon="plus"
                                  color={'#fff'}
                                  style={{backgroundColor: '#26988A'}}
                                  size={15}
                                  onPress={() =>
                                    this.increaseOrderQuantity(item.id)
                                  }
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                  <Paragraph style={styles.productAboutText}>
                    {itemDetails?.description}
                  </Paragraph>
                </Card.Content>
              </Card>
            </View>
          </ScrollView>

          <View style={styles.buttonViewStyle}>
            <View style={{flex: 1}}>
              {this.props.cartList?.filter(el => el?.id === item?.id)
                ?.length === 0 ? (
                <Button
                  mode="contained"
                  icon="shopping"
                  onPress={() => this.addItemToCart(item)}
                  labelStyle={styles.buttonTextStyle}>
                  ADD TO CART
                </Button>
              ) : (
                <Button
                  mode="contained"
                  icon="credit-card"
                  onPress={() => this.navigateToCart()}
                  labelStyle={styles.buttonTextStyle}>
                  CHECK OUT
                </Button>
              )}
            </View>
          </View>
        </View>
        <Snackbar
          visible={this.state.isSnackbarVisible}
          style={styles.snackbarStyle}
          onDismiss={() =>
            this.setState({
              isSnackbarVisible: false,
            })
          }
          duration={1000}
          action={{
            label: 'Checkout',
            onPress: () => {
              RootNavigation.navigate('Cart');
            },
          }}>
          Item was added to your cart
        </Snackbar>
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
const connectedApp = connect(mapState, actionCreators)(ItemDetails);
export {connectedApp as ItemDetails};
