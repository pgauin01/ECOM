import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";

const ProductItem = (props) => {
  return (
    <View style={styles.product}>
      <View style={styles.touchable}>
        <TouchableNativeFeedback onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.img} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <View style={styles.priceRow}>
                {/* <Text style={styles.price}>₹{props.oldPrice}</Text> */}
                <Text style={styles.newPrice}>₹{props.price.toFixed(2)}</Text>
              </View>
            </View>
            <View style={props.single ? styles.action : styles.actions}>
              {props.children}
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  product: {
    margin: 3,
    // alignItems: "center",
    flex: 1,
    // justifyContent: "center",
    elevation: 4,
    borderRadius: 10,
    backgroundColor: "white",
    height: 210,
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 12,
    marginVertical: 2,
    fontFamily: "open-sans-bold",
  },
  newPrice: {
    fontSize: 12,
    color: "#888",
    // textDecorationLine: "line-through",
    fontFamily: "open-sans-bold",
  },
  details: {
    alignItems: "center",
    height: "20%",
    padding: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
    height: "20%",
  },
  action: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
    height: "20%",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  // newPrice: {
  //   paddingLeft: 5,
  // },
});

export default ProductItem;
