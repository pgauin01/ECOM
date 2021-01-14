import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      color={"#727272"}
      IconComponent={Ionicons}
      iconSize={28}
    />
  );
};

export default CustomHeaderButton;
