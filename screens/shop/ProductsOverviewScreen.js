import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Text,
  Button,
  ActivityIndicator,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { SearchBar } from "react-native-elements";


import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/Cart";
import * as productActions from "../../store/actions/Products";
import * as addressActions from "../../store/actions/Address";
import * as adminActions from "../../store/actions/Admin";
import * as wishActions from "../../store/actions/wish";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Slider from "../../components/UI/Slider";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";


const images = [
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fredeem.jpg?alt=media&token=88f5012b-5293-484f-a964-148a55917044",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_1.png?alt=media&token=f4d512ba-7907-45c7-b69d-dac1b0e8f46e",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_2.png?alt=media&token=57439c02-f4b9-4d88-b843-186fef0fa149",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_3.png?alt=media&token=9f9eff25-25bb-4719-9350-10544baea706",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_4.png?alt=media&token=b8c6e0dd-30dc-4ffe-8ab9-0d1c121edf56",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/slider%2Fslide_5.png?alt=media&token=6a5a6e11-fc3f-4fc5-92cd-3a53eae8ba0c",
];

const cat = [
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/cat%2Fbasket.png?alt=media&token=afcccead-29eb-44e4-b66b-21e5f6ac4e83",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/cat%2Fcake%20(1).png?alt=media&token=cf2d6651-2055-49ca-a318-4e684dc8aac1",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/cat%2Fdrinks.png?alt=media&token=eb1bbc74-95f4-463b-8528-e956cdd257c4",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/cat%2Ffruits.png?alt=media&token=5efc3556-54e4-412c-9581-598374663cb5",
  "https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/cat%2Fmeat.png?alt=media&token=7817a637-0387-4bff-be74-d9874d1e3d10"
]

const catName = [
  "basket",
  "cake",
  "drinks",
  "fruits",
  "fish"
]

const ProductOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setIsError] = useState();
  const products = useSelector((state) => state.products.availableProducts);

  const featuredProduct = products.filter((el) => el.isfeatured === true);
  // console.log(featuredProduct);
  const wish = useSelector((state) => state.wish.wish);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setIsError(null);
    setIsRefreshing(true);
    setIsLoading(true);

    try {
      await dispatch(productActions.setProducts());
      setIsLoading(false);
    } catch (err) {
      setIsError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsError, setIsLoading]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(adminActions.isAdmin());
    setIsLoading(false);
  }, [dispatch]);

  const loadAddress = useCallback(async () => {
    setIsError(null);
    setIsLoading(true);
    try {
      await dispatch(addressActions.fetchAddress());
    } catch (err) {
      setIsError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts
    );
    loadAddress();

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [loadProducts]);
  const setWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(wishActions.setWish());
      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  }, [dispatch]);

  useEffect(() => {
    setWishlist();
  }, [setWishlist]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Products Found</Text>
      </View>
    );
  }

  const SelectHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  const AddToCart = (item) => {
    dispatch(cartActions.addToCart(item));
  };

  const AddToWish = (item) => {
    dispatch(wishActions.addtoWish(item));
  };

  const removeWishHandler = (id) => {
    dispatch(wishActions.removeWish(id));
  };

  return (
    <>
    <LinearGradient
      colors={[Colors.primary, Colors.secondary]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
    >
  <View style={{alignItems: "center", justifyContent: "flex-start"}}>
    <View style={{ width: "95%" , height:50 , marginTop: 10  }}>
    <SearchBar 
        round
        style={styles.searchbar}
        platform="android"
        placeholder="Search Products"
        lightTheme={true}
        containerStyle={{height:40,justifyContent: "center",borderTopLeftRadius:7, borderTopRightRadius:7,borderBottomRightRadius:7,borderBottomLeftRadius:7  }}
        inputContainerStyle={{borderTopLeftRadius:7, borderTopRightRadius:7,borderBottomRightRadius:7,borderBottomLeftRadius:7 }}
        searchIcon={{color:"black"}}
        inputStyle={{  fontSize: 18 , marginLeft:0}}
        placeholderTextColor="#787878"
        // inputStyle={{ alignItems: "center"}}
        // onChangeText={(text) => searchFilter(text)}
        // value={search}
        // onClear={clearSearchData}
      />
    </View>
 
  </View>
  </LinearGradient>
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={loadProducts} />
      }
    >
      <View style={{ marginTop: 15, marginBottom:15, height: 70, width: "100%" }}>
        <ScrollView
          horizontal
          // pagingEnabled
          showsVerticalScrollIndicator ={false}
          showsHorizontalScrollIndicator={false}
          // onMomentumScrollEnd={this.changeSelectedIndex}
          // ref={this.scrollRef}
        >
          {cat.map((image , index) => (
            <View style={{ flex: 1 , flexDirection: "column", alignItems:"center"}}>
              <Image
              key={image}
              source={{ uri: image }}
              style={styles.backgroundImage}
            />
           
              <Text style={{ color: "black", fontSize: 16 }}>{catName[index]}</Text>
            </View>
            
          ))}
        </ScrollView>
        </View>

      <View style={{ marginTop: 0, width: "100%", height: 230 }}>
        <Slider images={images} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>Today's Deal</Text>
      </View>
      <FlatList
        data={featuredProduct}
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
            {wish.find((el) => el.id === itemData.item.id) ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  removeWishHandler(itemData.item.id);
                }}
              >
                <Ionicons
                  name={Platform.OS === "android" ? "md-heart" : "md-heart"}
                  size={16}
                  color={styles.wishcolor}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  AddToWish(itemData.item);
                }}
              >
                <Ionicons
                  name={Platform.OS === "android" ? "md-heart" : "md-delete"}
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            )}

            {itemData.item.inStock ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  AddToCart(itemData.item);
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>
                  Add to Cart
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonOut}
                disabled={true}
                onPress={() => {
                  AddToCart(itemData.item);
                }}
              >
                <Text style={{ color: "black", fontSize: 12 }}>
                  Out of Stock
                </Text>
              </TouchableOpacity>
            )}
          </ProductItem>
        )}
      />
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>All Products</Text>
      </View>
      <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
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
            {wish.find((el) => el.id === itemData.item.id) ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  removeWishHandler(itemData.item.id);
                }}
              >
                <Ionicons
                  name={Platform.OS === "android" ? "md-heart" : "md-heart"}
                  size={16}
                  color={styles.wishcolor}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  AddToWish(itemData.item);
                }}
              >
                <Ionicons
                  name={Platform.OS === "android" ? "md-heart" : "md-delete"}
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            )}
            {itemData.item.inStock ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  AddToCart(itemData.item);
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>
                  Add to Cart
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonOut}
                disabled={true}
                onPress={() => {
                  AddToCart(itemData.item);
                }}
              >
                <Text style={{ color: "black", fontSize: 12 }}>
                  Out of Stock
                </Text>
              </TouchableOpacity>
            )}
          </ProductItem>
        )}
      />
    </ScrollView>
    </>
  );
};

ProductOverviewScreen.navigationOptions = (navData) => {
  return {
 
    headerTitle: "",
    headerLeft: () => (
      <View style={{ flexDirection: "row" }}>
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName="md-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
      <Image source={{ uri:"https://firebasestorage.googleapis.com/v0/b/e-commerce-app-b62a8.appspot.com/o/cat%2Flogo200e.png?alt=media&token=45b2a15c-4b68-4006-9d4d-8cf6baef5b9f"}} style={{width:50 , height: 50 }}/>
</View>
      
    ),
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          {/* <Item
            title="Search"
            iconName="md-search"
            onPress={() => {
              navData.navigation.navigate("Search");
            }}
          /> */}
        </HeaderButtons>
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
  textContainer: {
    marginTop: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    elevation: 5,
    fontFamily: "open-sans-bold",


    // borderRadius: 10,
  },
  buttonOut: {
    backgroundColor: "#DCDCDC",
    paddingHorizontal: 10,
    paddingVertical: 7,
    elevation: 5,
  },
  wishcolor: {
    backgroundColor: Colors.tertiary,
  },
  searchbar:{
    width:30,
    height:10, 
    padding:5
  },
  backgroundImage: {
    height: 50,
    width: 50,
    marginHorizontal:30
    // width: DEVICE_WIDTH,
    // resizeMode: "cover",
  },
  
});

export default ProductOverviewScreen;
