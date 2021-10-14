import React, {Component} from 'react';
import {View, StyleSheet, Text, Dimensions, StatusBar} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  Button,
  Modal,
  Portal,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Colors,
  TextInput,
} from 'react-native-paper';
import {Appbar} from 'react-native-paper';
import * as RootNavigation from './../../RootNavigation';
import {connect} from 'react-redux';
import {
  itemsActions,
  cartActions,
  addressActions,
  userActions,
  orderActions,
  feedbackActions,
} from './../../actions';
import {Rating} from 'react-native-rating-element';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Feedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      comment: '',
      rating: 1,
      imageUrl: '',
      userDetails: null,
      submitted: false,
      customer_id: null,
      openFeedbackModal: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.feedbackSend !== this.props.feedbackSend) {
      if (this.props.feedbackSend === true) {
        this.clear();
       this.setState({
           openFeedbackModal: true
       })
      }
    }
  }

  navigateTo() {
    RootNavigation.navigate("Browser");
  }

  async componentDidMount() {
    let user = await AsyncStorage.getItem('user');
    let userObj = JSON.parse(user);
    let userId = userObj?.id;
    if (userId) {
      this.props.getUserDetails(userId);
      this.setState({
        customer_id: userId,
      });
    }
  }

  submitFeedback() {
    this.setState({
      submitted: true,
    });
    const orderDetails = this.props.route.params.orderDetails;
    if (this.state.comment) {
       
      let req = {
        customer_id: this.state.customer_id,
        order_id: orderDetails.id,
        rating: this.state.rating,
        remarks: this.state.comment,
      };
      this.props.sendFeedback(req);
    }
  }

  clear() {
    this.setState({
      comment: '',
      rating: 1,
      submitted: false,
    });
  }

  render() {
    const styles = StyleSheet.create({
      appHeaderStyle: {
        backgroundColor: '#fff',
        color: '#424242',
        elevation: 1,
      },
    });

    return (
      <View style={{position: 'relative', paddingTop: StatusBar.currentHeight}}>
        {this.props.isSendingFeedback ? (
          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
            }}>
            <ActivityIndicator
              size="large"
              animating={true}
              color={Colors.red800}
            />
          </View>
        ) : (
          <View></View>
        )}

        <Appbar.Header style={styles.appHeaderStyle}>
          <Appbar.BackAction
            onPress={() => {
              this.navigateTo();
            }}
            style={{marginTop: 10, backgroundColor: '#fff'}}
          />

          <Appbar.Content
            title={'Give your feedback'}
            style={{marginLeft: -13}}
            titleStyle={{fontFamily: "Poppins-Regular", lineHeight: 28}}
          />
        </Appbar.Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card style={{marginHorizontal: 10, borderRadius: 5, marginTop: 10}}>
            <Title
              style={{
                fontSize: 16,
                fontFamily: "Poppins-SemiBold",
                marginHorizontal: 16,
                marginBottom: 5,
                marginTop: 15,
                lineHeight: 23,
                color: '#424242',
              }}>
              We want to hear from you
            </Title>

            <Card.Content>
              <Paragraph style={{fontFamily: "Poppins-Regular"}}>
                About the items you just purchased from us. We are really happy
                to know your feedback about the items that you received. Please
                add some suggestion what we can do better for you.
              </Paragraph>
              <TextInput
                multiline={true}
                numberOfLines={5}
                style={{
                  backgroundColor: '#f5f5f5',
                  paddingHorizontal: 10,
                  marginTop: 10,
                }}
                value={this.state.comment}
                onChangeText={text => this.setState({comment: text})}
              />
              {this.state.submitted && !this.state.comment && (
                <Text
                  style={{
                    color: 'red',
                    marginTop: 10,
                    marginHorizontal: 0,
                    fontFamily: "Poppins-Regular"
                  }}>
                  Please mention about the experience with the app
                </Text>
              )}
              <Paragraph style={{marginTop: 20, marginBottom: 10, fontFamily: "Poppins-Regular"}}>
                Rate Us
              </Paragraph>
              <Rating
                rated={this.state.rating}
                totalCount={5}
                ratingColor="#f1c644"
                ratingBackgroundColor="#d4d4d4"
                size={30}
                icon="ios-star"
                direction="row"
                onIconTap={position => this.setState({rating: position})}
              />
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            labelStyle={{fontSize: 16, fontFamily: "Poppins-SemiBold"}}
            uppercase={false}
            style={{marginHorizontal: 10, borderRadius: 20, marginTop: 10}}
            onPress={() => this.submitFeedback()}>
            {this.props.isSendingFeedback ? "SENDING..." : "SEND"}
          </Button>

          <View style={{height: 150}}></View>
        </ScrollView>
        <Portal>
          <Modal
            visible={this.state.openFeedbackModal}
            onDismiss={e =>
              this.setState(
                {
                  openFeedbackModal: false,
                },
                () => RootNavigation.navigate('Browser'),
              )
            }
            contentContainerStyle={{
              backgroundColor: '#fff',
              padding: 20,
              margin: 20,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#424242',
                fontSize: 70,
                marginBottom: 10,
                textAlign: 'center',
              }}>
              🙂
            </Text>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                color: '#424242',
                fontSize: 20,
                marginBottom: 10,
                textAlign: 'center',
              }}>
              Thank You
            </Text>

            <Text style={{fontSize: 18, marginBottom: 10, textAlign: 'center', fontFamily: "Poppins-Regular"}}>
              We appreciate and value your feedback or suggestion and try to
              bring up your suggestion in our next update if any.
            </Text>
            <View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Button
                  mode="contained"
                  uppercase={false}
                  style={{
                    width: !this.props.isDeleting ? 100 : 120,
                    elevation: 0,
                    borderRadius: 5,
                    marginTop: 15,
                    marginRight: 10,
                  }}
                  labelStyle={{fontFamily: "Poppins-SemiBold"}}
                  onPress={() =>
                    this.setState(
                      {
                        openFeedbackModal: false,
                      },
                      () => RootNavigation.navigate('Browser'),
                    )
                  }>
                  Close
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      </View>
    );
  }
}

function mapState(state) {
  const {appLanguage, cart, address, user, order, items, feedback} = state;
  const {userDetails, isRegistering, userRegistered} = user;
  const {isLoadingItems, itemList} = items;
  const {isSendingFeedback, feedbackSend} = feedback;
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
    isSendingFeedback,
    feedbackSend,
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
  sendFeedback: feedbackActions.sendFeedback,
};
const connectedApp = connect(mapState, actionCreators)(Feedback);
export {connectedApp as Feedback};
