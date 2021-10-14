import React, {Component} from 'react';
import {itemsActions, cartActions} from './../../actions';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Card, Button, Title, Paragraph, IconButton} from 'react-native-paper';
import {priceSymbolConstants} from '../../constants';
import * as RootNavigation from './../../RootNavigation';

const navigateTo = item => {
  RootNavigation.navigate('ItemDetails', {item: item});
};

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  addItemToCart(item) {
    this.props.addItemToUserCart(item);
  }
  increaseOrderQuantity(id) {
    this.props.increaseOrderQuantity(id);
  }

  decreaseOrderQuantity(id) {
    let orderQuantity = this.props.cartList.filter(
      el => el.id === this.props.item?.id,
    )[0].orderQuantity;
    if (orderQuantity === 1 || orderQuantity === '1') {
      this.props.removeItemFromCart(id);
    } else {
      this.props.decreaseOrderQuantity(id);
    }
  }
  render() {
    const itemDetails = this.props.item[this.props.selectedLanguage];
    const width = Dimensions.get('window').width / 2 - 20;
    const priceSymbol = priceSymbolConstants[this.props.item.country];

    return (
      <Card style={{...styles.card, width}}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigateTo(this.props.item)}>
          <Card.Cover
            source={{
              uri: this.props.item?.product_attachments[0]?.attachment_url,
            }}
            style={styles.itemCoverImageStyle}
          />
          <Card.Content style={styles.cardContentStyle}>
            <Title style={styles.itemNameStyle} numberOfLines={2}>
              {itemDetails?.name}{' '}
            </Title>
            <Paragraph style={styles.itemDescriptionStyle}>
              {itemDetails?.sub_description}
            </Paragraph>
          </Card.Content>
        </TouchableOpacity>

        <Card.Actions style={styles.cardActionStyle}>
          <Text style={styles.itemPriceTextStyle}>
            {' '}
            <Text style={styles.itemPriceSymbolTextStyle}>
              {priceSymbol ? priceSymbol : ''}
            </Text>{' '}
            {this.props.item?.price} /-
          </Text>
        </Card.Actions>
        <Card.Actions style={styles.cardActionButtonStyle}>
          <View>
            {this.props.cartList.filter(el => el.id === this.props.item.id)
              ?.length === 0 ? (
              <Button
                mode="contained"
                labelStyle={styles.addToCartButtonLabelStyle}
                style={styles.addToCartButtonStyle}
                onPress={e => this.addItemToCart(this.props.item)}>
                Add
              </Button>
            ) : (
              <View style={styles.viewStyle}>
                <View style={styles.plusMinusButtonViewStyle}>
                  <View>
                    <IconButton
                      icon="minus"
                      color={'#fff'}
                      size={12}
                      style={styles.plusMinusButtonStyle}
                      onPress={() =>
                        this.decreaseOrderQuantity(this.props.item.id)
                      }
                    />
                  </View>
                  <TextInput
                    style={styles.textInputStyle}
                    keyboardType="numeric"
                    value={
                      this.props.cartList.filter(
                        el => el.id === this.props.item?.id,
                      )[0].orderQuantity + ''
                    }
                    onChangeText={text =>
                      this.props.setQuantity(this.props.item.id, text)
                    }
                  />
                  <View>
                    <IconButton
                      icon="plus"
                      color={'#fff'}
                      style={styles.plusMinusButtonStyle}
                      size={12}
                      onPress={() =>
                        this.increaseOrderQuantity(this.props.item.id)
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </Card.Actions>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    elevation: 0,
    marginBottom: 10,
  },
  cardContentStyle: {
    paddingHorizontal: 0,
  },
  itemNameStyle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#3A3A3A',
    lineHeight: 20,
    paddingTop: 5,
  },
  itemDescriptionStyle: {
    color: 'gray',
    paddingBottom: 5,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  addToCartButtonStyle: {
    borderRadius: 5,
    elevation: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: -5,
  },
  addToCartButtonLabelStyle: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  itemPriceTextStyle: {
    fontSize: 16,
    color: '#26988A',
    fontFamily: 'Poppins-SemiBold',
  },
  itemPriceSymbolTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#26988A',
  },
  itemCoverImageStyle: {
    height: 120,
  },
  cardActionStyle: {
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 0,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  itemQuantityStyle: {
    fontWeight: 'bold',
    color: 'gray',
    paddingHorizontal: 10,
  },
  infoContainerStyle: {
    flex: 1,
    alignItems: 'flex-start',
  },
  cardActionButtonStyle: {
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  textInputStyle: {
    textAlign: 'center',
    height: 20,
    width: 50,
    borderRadius: 2,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 0,
    color: "#424242"
  },
  plusMinusButtonStyle: {
    backgroundColor: '#26988A',
    borderRadius: 10,
  },
  plusMinusButtonViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: -5,
    marginTop: -5,
  },
});

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
const connectedApp = connect(mapState, actionCreators)(Item);
export {connectedApp as Item};
