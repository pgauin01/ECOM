import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import ProductItem from "../../components/shop/ProductItem";
import * as wishActions from "../../store/actions/wish";
import { Ionicons } from "@expo/vector-icons";
import * as cartActions from "../../store/actions/Cart";

const WishListScreen = (props) => {
  const [loading, setIsLoading] = useState(false);
  const wish = useSelector((state) => state.wish.wish);
  const dispatch = useDispatch();

  const SelectHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };
  const AddToCart = (item) => {
    dispatch(cartActions.addToCart(item));
  };
  const removeWishHandler = (id) => {
    dispatch(wishActions.removeWish(id));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }
  if (wish.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Items in WishList</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={wish}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={(itemData) => (
        <ProductItem
          single
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          oldPrice={itemData.item.oldprice}
          onSelect={() => {
            SelectHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              removeWishHandler(itemData.item.id);
            }}
          >
            <Ionicons
              name={Platform.OS === "android" ? "md-trash" : "md-trash"}
              size={16}
              color="white"
            />
          </TouchableOpacity>

          {itemData.item.inStock ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                AddToCart(itemData.item);
              }}
            >
              <Text style={{ color: "white", fontSize: 12 }}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonOut}
              disabled={true}
              onPress={() => {
                AddToCart(itemData.item);
              }}
            >
              <Text style={{ color: "black", fontSize: 12 }}>Out of Stock</Text>
            </TouchableOpacity>
          )}
        </ProductItem>
      )}
    />
  );
};

WishListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "WishList",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName="md-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Cart"
            iconName="md-cart"
            onPress={() => {
              navData.navigation.navigate("Cart");
            }}
          />
        </HeaderButtons>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    elevation: 5,
    // borderRadius: 10,
  },
  buttonOut: {
    backgroundColor: "#DCDCDC",
    paddingHorizontal: 10,
    paddingVertical: 7,
    elevation: 5,
  },
});

export default WishListScreen;
