import React, {Component} from 'react';
import {appLanguageActions, itemsActions} from './../../actions';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  StatusBar,
  Linking,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import {
  IconButton,
  Portal,
  Modal,
  Button,
  Snackbar,
  Card,
  Paragraph,
  Appbar,
} from 'react-native-paper';
import * as RootNavigation from './../../RootNavigation';
import {Item} from '../Item/Item';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const FlatListHeaderComponent = () => {
  return (
    <View>
      <View>
        <Card style={styles.flatListHeaderComponentCardStyle}>
          <ImageBackground
            source={require('../../assets/bg.jpg')}
            style={styles.ImageBackgroundStyle}
            blurRadius={4}>
            <Card.Content
              style={styles.flatListHeaderComponentCardContentStyle}>
              <View style={{}}>
                <View>
                  <Paragraph
                    style={
                      styles.flatListHeaderComponentCardContentParagraphStyle
                    }>
                    You can directly use our mail id alakarte@support.com to
                    order your ingredients for our restaurants
                  </Paragraph>
                  <View
                    style={styles.flatListHeaderComponentCardContentViewStyle}>
                    <Button
                      icon="gmail"
                      mode="contained"
                      style={styles.contactUsButtonStyle}
                      labelStyle={styles.contactUsButtonTextStyle}
                      onPress={() =>
                        Linking.openURL(
                          `mailto:alakarte@customerHelpDesk.com?subject=Alkarte Contact Us&body=Please type here`,
                        )
                      }>
                      Contact US
                    </Button>
                  </View>
                </View>
              </View>
            </Card.Content>
          </ImageBackground>
        </Card>
      </View>
      <View style={styles.exploreOurProductContainerStyle}>
        <Text style={styles.exploreOurProductTextStyle}>
          EXPLORE OUR INGREDIENTS
        </Text>
      </View>
    </View>
  );
};

const AppStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleLanguageSetModal: false,
      isSnackbarVisible: false,
    };
  }

  async componentDidMount() {
    this.props.getItems();
    let appLanguage = await AsyncStorage.getItem('language');
    if (!appLanguage) {
      AsyncStorage.setItem('language', 'EN');
      this.setState({
        isVisibleLanguageSetModal: true,
      });
    } else {
      this.props.setLanguage(appLanguage);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cartList !== this.props.cartList) {
      if (prevProps.cartList?.length < this.props.cartList?.length) {
        this.setState({
          isSnackbarVisible: true,
        });
      }
    }
  }

  onRefresh() {
    this.props.getItems();
  }

  render() {
    return (
      <View style={styles.container}>
        <AppStatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Appbar.Header style={styles.appHeaderStyle}>
          <Appbar.Content
            title="à la karte"
            titleStyle={styles.appHeaderTitleStyle}
            subtitle="Pick.Click.Quick"
            subtitleStyle={styles.appHeaderSubTitleStyle}
          />
          <Appbar.Action
            icon="shopping"
            color={'#26988A'}
            onPress={() => {
              RootNavigation.navigate('Cart');
            }}
          />
        </Appbar.Header>

        <OptimizedFlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={FlatListHeaderComponent}
          columnWrapperStyle={styles.columnWrapperStyle}
          numColumns={2}
          onRefresh={() => this.onRefresh()}
          refreshing={this.props.isLoadingItems}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={true}
          contentContainerStyle={styles.contentContainerStyle}
          data={this.props.itemList}
          renderItem={({item}) => {
            return <Item item={item} />;
          }}
          onRefresh={() => this.onRefresh()}
          refreshing={this.props.isLoadingItems}
        />
        <Portal>
          <Modal
            visible={this.state.isVisibleLanguageSetModal}
            onDismiss={e => this.setState({isVisibleLanguageSetModal: false})}
            contentContainerStyle={styles.modalContentContainerStyle}>
            <View style={styles.languageIconContainer}>
              <IconButton
                icon="translate"
                size={35}
                color="#424242"></IconButton>
            </View>

            <Text style={styles.modalTextStyle}>
              Hey, Do you want to change your language of the app.
            </Text>
            <View>
              <View style={styles.modalButtonContainer}>
                <Button
                  mode="contained"
                  uppercase={false}
                  style={styles.modalYesButtonStyle}
                  onPress={() => {
                    this.setState({isVisibleLanguageSetModal: false});
                    RootNavigation.navigate('AppLanguage');
                  }}>
                  Yes
                </Button>
                <Button
                  mode="outlined"
                  uppercase={false}
                  style={styles.modalNoButtonStyle}
                  onPress={e =>
                    this.setState({isVisibleLanguageSetModal: false})
                  }>
                  NO
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
        <Snackbar
          visible={this.state.isSnackbarVisible}
          style={styles.snackBarStyle}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  contentContainerStyle: {
    paddingBottom: 250,
    paddingTop: 0,
  },
  logoStyle: {
    flex: 1,
    resizeMode: 'contain',
    width: Dimensions.get('window').width - 200,
  },
  logoContainerStyle: {
    height: 100,
    alignItems: 'center',
    marginTop: -25,
    marginBottom: 15,
  },
  cartIconContainerStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activeCartIndicatorStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 10,
    width: 10,
    backgroundColor: '#F3B434',
    borderRadius: 10,
    elevation: 2,
  },
  phoneIconStyle: {
    backgroundColor: '#fff',
    borderRadius: 50,
    marginTop: 16,
  },
  rightArrowIconStyle: {
    borderRadius: 8,
    backgroundColor: '#26988A',
    marginBottom: 10,
    marginTop: -20,
  },
  cartIconWrapperStyle: {
    alignItems: 'flex-end',
  },
  contactNumberStyle: {
    color: '#fff',
  },
  contactTextStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContentContainerStyle: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 5,
  },
  modalYesButtonStyle: {
    width: 100,
    elevation: 0,
    borderRadius: 5,
    marginTop: 15,
    marginRight: 10,
  },
  modalNoButtonStyle: {
    width: 100,
    elevation: 0,
    borderRadius: 5,
    marginTop: 15,
  },
  modalButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  languageIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreOurProductContainerStyle: {
    paddingHorizontal: 11,
    paddingBottom: 10,
    marginTop: 10,
  },
  exploreOurProductTextStyle: {
    fontSize: 16,
    color: '#3A3A3A',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  snackBarStyle: {
    marginBottom: 80,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  appHeaderStyle: {
    backgroundColor: '#fff',
    elevation: 0,
  },
  appHeaderTitleStyle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#26988A',
    fontSize: 22,
    lineHeight: 30,
  },
  appHeaderSubTitleStyle: {
    color: 'gray',
    fontSize: 12,
    marginTop: -3,
    fontFamily: 'Poppins-Italic',
  },
  ImageBackgroundStyle: {
    width: '100%',
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatListHeaderComponentCardStyle: {
    borderRadius: 0,
  },
  flatListHeaderComponentCardContentStyle: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  modalTextStyle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: "#424242"
  },
  flatListHeaderComponentCardContentParagraphStyle: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  flatListHeaderComponentCardContentViewStyle: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
  contactUsButtonStyle: {
    borderRadius: 25,
    elevation: 0,
  },
  contactUsButtonTextStyle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    lineHeight: 15
  },
});

function mapState(state) {
  const {items, appLanguage, cart} = state;
  const {cartList} = cart;
  const {isLoadingItems, itemList} = items;
  const {selectedLanguage} = appLanguage;
  return {
    isLoadingItems,
    itemList,
    selectedLanguage,
    cartList,
  };
}

const actionCreators = {
  getItems: itemsActions.getItems,
  setLanguage: appLanguageActions.setLanguage,
};
const connectedApp = connect(mapState, actionCreators)(Home);
export {connectedApp as Home};
