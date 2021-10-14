import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions
} from 'react-native';
import {
  itemsActions,
  cartActions,
  addressActions,
  userActions,
  orderActions,
  uploadActions,
} from './../../actions';
import {connect} from 'react-redux';
import {
  Card,
  Paragraph,
  Title,
  Button,
  Portal,
  Modal,
  List,
  ActivityIndicator,
  Colors,
  Appbar,
  IconButton
} from 'react-native-paper';
import * as RootNavigation from './../../RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import CheckUserAccess from '../CheckUserAccess/CheckUserAccess';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.state = {
      image: null,
      submitted: false,
      userDetails: null,
      isDisplayModal: false,
      hasCameraPermission: null,
      openCamera: false,
      recording: undefined,
      mediaType: 'image',
      showErrorMessage: false,
      isModalVisible: false,
    };
  }

  async componentDidMount() {
    this.props.clearCart();
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

  componentDidUpdate(prevProps) {
    if (prevProps.updatedOrder !== this.props.updatedOrder) {
      if (this.props.updatedOrder === true) {
        this.setState({
          isModalVisible: true,
        });
      }
    }
  }

  navigateTo = () => {
    RootNavigation.navigate('Browser');
  };

  navigateToHome = () => {
    RootNavigation.navigate('Browser', { index: 1, routes: "Home" });
  };

  navigateToOrderHistory = () => {
    this.setState({
      isModalVisible: false,
      image: null
    });
    RootNavigation.navigate('OrderHistory');
  };

  openCamera = () => {
    this.setState({
      showErrorMessage: false,
    });
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(res => {
      this.setState({
        image: res.path,
      });
    });
  };

  imagePicker = () => {
    this.setState({
      showErrorMessage: false,
    });
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(res => {
      this.setState({
        image: res.path,
      });
    });
  };

  uploadFile() {
    if (this.state.image) {
      let formData = new FormData();
      let localUri = this.state.image;
      let filename = localUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      formData.append('file', {uri: localUri, name: filename, type});
      let orderId = this.props.route.params.orderDetails.id;
      let orderDetails = this.props.orderList?.filter(
        el => el.id === orderId,
      )[0];

      let request = {
        customer_address_id: orderDetails.customer_address_id,
        id: orderId,
        customer_id: orderDetails.customer_id,
      };

      this.props.uploadFile(formData, request);
    } else {
      this.setState({
        showErrorMessage: true,
      });
    }
  }

  render() {
    const orderDetails = this.props.route.params.orderDetails;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        position: 'relative',
        paddingTop: StatusBar.currentHeight,
      },
      inverted: {
        transform: [{scaleY: -1}],
      },
      content: {
        padding: 0,
      },
      input: {
        alignItems: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 24,
      },
      postImageHeight: {
        height: 280,
      },
      userNameText: {
        fontSize: 14,

        marginTop: -5,
      },
      locationText: {
        marginTop: -8,
      },
      labelText: {
        fontSize: 14,
        marginTop: -2,
      },
      forumCard: {
        marginTop: 2,
        elevation: 0,
        backgroundColor: '#fff',
      },
      postTitleText: {
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 20,
        paddingTop: 10,
        color: '#424242',
      },
      postImageHeight: {
        height: 300,
      },
      userNameText: {
        fontSize: 14,

        marginTop: -5,
      },
      locationText: {
        marginTop: -8,
      },
      appHeaderStyle: {
        backgroundColor: '#fff',
        color: '#424242',
        elevation: 1,
        position: 'relative',
      },
    });

    return (
      <CheckUserAccess>
        <View style={styles.container}>
        {this.props.isUpdatingOrder ? (
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
          <View>
            <Appbar.Header style={styles.appHeaderStyle}>
              <Appbar.Content title="Upload your payment details" titleStyle={{fontFamily: "Poppins-Regular", lineHeight: 28}}/>
            </Appbar.Header>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            <View style={{position: 'relative'}}>
              {this.props.isUpdatingOrder ? (
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
              <Card style={{backgroundColor: '#26988A'}}>
                <Card.Content>
                  <Paragraph
                    style={{fontFamily: "Poppins-SemiBold", color: '#fff', fontSize: 18, lineHeight: 35}}>
                    Hello {this.props.userDetails?.name}
                  </Paragraph>
                  <Paragraph style={{color: '#fff', fontSize: 14, fontFamily: "Poppins-Regular"}}>
                    You have successfully ordered from us. Please make a payment
                    using below mentioned àlakarte account number using any of
                    the payment system.
                  </Paragraph>
                  <Paragraph
                    style={{
                      fontFamily: "Poppins-SemiBold",
                      color: '#fff',
                      fontSize: 14,
                      marginTop: 10,
                    }}>
                    After your payment of {orderDetails?.price_symbol} {orderDetails?.sub_total || 0} only
                    we will verify & start initiating the shipment of your
                    purchased items. you will also receive a notification once
                    shipment started from us.
                  </Paragraph>
                </Card.Content>
              </Card>

              <Card style={{}}>
                <Card.Content>
                  <Paragraph
                    style={{
                      fontFamily: "Poppins-SemiBold",
                      color: '#26988A',
                      fontSize: 22,
                      lineHeight: 30
                    }}>
                    à la karte
                  </Paragraph>
                  <Paragraph
                    style={{
                      color: 'gray',
                      fontSize: 14,
                      marginTop: -3,
                      marginBottom: 15,
                      fontFamily: "Poppins-Regular"
                    }}>
                    Account Number
                  </Paragraph>
                  <Title
                    style={{
                      fontFamily: "Poppins-SemiBold",
                      color: '#26988A',
                      fontSize: 28,
                      lineHeight: 38
                    }}>
                    1209-8908-9089-0989
                  </Title>
                  <Paragraph
                    style={{color: 'gray', fontSize: 15, marginTop: 10, fontFamily: "Poppins-Regular",}}>
                    Please upload only the transaction bill that you got after
                    you made the payment using above mentioned account number
                  </Paragraph>
                </Card.Content>
              </Card>

              {this.state.image ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#112A54',
                        fontFamily: "Poppins-SemiBold",
                        marginVertical: 10,
                        marginHorizontal: 0,
                      }}>
                      {' '}
                      Selected Image
                    </Text>

                    <View
                      style={{
                        borderRadius: 10,
                        height: 120,
                        backgroundColor: '#fff',
                        elevation: 1,
                        marginLeft: 10,
                      }}>
                      <Image
                        source={{uri: this.state.image}}
                        style={{
                          height: 120,
                          width: 120,
                          borderRadius: 10,
                        }}></Image>
                    </View>
                  </View>
                </View>
              ) : (
                <View></View>
              )}

              <List.Section style={{backgroundColor: '#fff', marginTop: 2}}>
                <List.Subheader
                  style={{fontFamily: "Poppins-SemiBold", color: '#424242', fontSize: 16}}>
                  Upload Proof
                </List.Subheader>
                <List.Item
                  style={{marginVertical: -5}}
                  title="Take a picture"
                  titleStyle={{fontFamily: "Poppins-Regular",}}
                  left={() => (
                    <List.Icon
                      icon="camera"
                      color={Colors.white}
                      style={{backgroundColor: '#26988A', borderRadius: 50}}
                    />
                  )}
                  onPress={() => this.openCamera()}
                  right={() => (
                    <List.Icon icon="chevron-right" color={'#d4d4d4'} />
                  )}
                />
                <List.Item
                  style={{marginVertical: -5}}
                  title="Select from gallery"
                  titleStyle={{fontFamily: "Poppins-Regular",}}
                  left={() => (
                    <List.Icon
                      color={Colors.white}
                      style={{backgroundColor: '#26988A', borderRadius: 50}}
                      icon="image"
                    />
                  )}
                  right={() => (
                    <List.Icon icon="chevron-right" color={'#d4d4d4'} />
                  )}
                  onPress={() => this.imagePicker()}
                />
              </List.Section>
              {this.state.showErrorMessage ? (
                <Text
                  style={{
                    color: 'red',
                    paddingHorizontal: 10,
                    paddingBottom: 4,
                  }}>
                  {' '}
                  Please upload your bill first
                </Text>
              ) : (
                <View></View>
              )}
              <Button
                mode="contained"
                labelStyle={{fontSize: 16, fontFamily: "Poppins-SemiBold", lineHeight: 20}}
                uppercase={true}
                style={{
                  marginHorizontal: 10,
                  borderRadius: 3,
                  marginTop: 5,
                  borderRadius: 20,
                }}
                onPress={() => this.uploadFile()}>
                {this.props.isUploading ? 'Uploading ...' : 'Upload'}
              </Button>

              <View style={{marginTop: 10, alignItems: 'center'}}>
                <Text style={{fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#424242"}}>OR</Text>
              </View>
              <Button
                mode="contained"
                labelStyle={{fontSize: 16, fontFamily: "Poppins-SemiBold", lineHeight: 20}}
                uppercase={true}
                style={{
                  marginHorizontal: 10,
                  borderRadius: 3,
                  marginTop: 5,
                  borderRadius: 20,
                }}
                onPress={() => this.navigateToHome()}>
                CONTINUE VIEW PRODUCT
              </Button>

              <Portal>
                <Modal
                 visible={this.state.isModalVisible}
                 
                  onDismiss={e =>
                    this.setState(
                      {
                        isModalVisible: false,
                      },
                      () => this.navigateToOrderHistory(),
                    )
                  }
                  contentContainerStyle={{
                    backgroundColor: '#fff',
                    padding: 20,
                    margin: 20,
                    borderRadius: 5,
                  }}>
                 <View style={{alignItems: "center"}}>
                 <IconButton
                    icon="check-circle"
                    color={"#26988A"}
                    size={50}
                   
                  />
                 </View>
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      textAlign: 'center',
                      fontFamily: "Poppins-Regular",
                      color: "#424242"
                    }}>
                    Your payment bill was uploaded successfully. We will soon
                    verify and process your shipment of your purchased item.
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
                        labelStyle={{ fontFamily: "Poppins-Regular"}}
                        style={{
                          width: 100,
                          elevation: 0,
                          borderRadius: 5,
                          marginTop: 15,
                          marginRight: 10,
                          
                        }}
                        onPress={() => this.navigateToOrderHistory()}>
                        Close
                      </Button>
                    </View>
                  </View>
                </Modal>
              </Portal>

              <View style={{height: 300}}></View>
            </View>
          </ScrollView>
        </View>
      </CheckUserAccess>
    );
  }
}

function mapState(state) {
  const {appLanguage, cart, address, user, order, upload} = state;
  const {isUploading, isUploaded} = upload;
  const {userDetails, isRegistering, userRegistered, isLoadingUserDetails} =
    user;
  const {cartList} = cart;
  const {
    orderList,
    isOrderListLoading,
    orderListLoaded,
    isOrdering,
    orderingSuccessful,
    specialInstruction,
    isUpdatingOrder,
    updatedOrder,
  } = order;
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
    isLoadingUserDetails,
    orderList,
    isOrderListLoading,
    orderListLoaded,
    isOrdering,
    orderingSuccessful,
    specialInstruction,
    isUpdatingOrder,
    updatedOrder,
    isUploading,
    isUploaded,
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
  setSpecialInstruction: orderActions.setSpecialInstruction,
  makeOrder: orderActions.makeOrder,
  clearCart: cartActions.clearCart,
  updateOrder: orderActions.updateOrder,
  uploadFile: uploadActions.uploadFile,
};
const connectedApp = connect(mapState, actionCreators)(Payment);
export {connectedApp as Payment};
