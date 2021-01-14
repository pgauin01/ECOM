// import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableNativeFeedback,
} from "react-native";
// import * as authActions from "../../store/actions/Auth";
// import { useDispatch } from "react-redux";
// import { Ionicons } from "@expo/vector-icons";
// import * as Google from "expo-google-sign-in";
// import * as Google from "expo-google-app-auth";

// const LoginScreen = (props) => {
// const [isLoading, setIsLoading] = useState(false);
// // console.log(isLoading);
// const [error, setError] = useState();
// const dispatch = useDispatch();
// const signInWithGoogle = async () => {
//   setIsLoading(true);
//   try {
//     const result = await Google.logInAsync({
//       // iosClientId: IOS_CLIENT_ID,
//       androidClientId: ANDROID_CLIENT_ID,
//       scopes: ["profile", "email"],
//     });
//     setIsLoading(false);

//     // console.log(result.idToken);
//     // console.log(result.user.id);
//     setError(null);
//     setIsLoading(true);
//     try {
//       await dispatch(authActions.Googlelogin(result.idToken));
//     } catch (err) {
//       setError(err.message);
//     }
//     setIsLoading(false);

//     if (result.type === "success") {
//       console.log("LoginScreen.js.js 21 | ", result.user.givenName);
//       props.navigation.navigate("Shop");
//       //after Google login redirect to Profile
//       return result.accessToken;
//     } else {
//       return { cancelled: true };
//     }
//   } catch (e) {
//     console.log("LoginScreen.js.js 30 | Error with login", e);
//     return { error: true };
//   }
// };

// return (
// <View style={styles.container}>
//   <TouchableNativeFeedback onPress={signInWithGoogle}>
//     {isLoading ? (
//       <ActivityIndicator color="red" size="small" />
//     ) : (
//       <View style={styles.rowStyles}>
//         <View>
//           <Text style={styles.text}>Login with</Text>
//         </View>
//         <View
//           style={{
//             marginLeft: 10,
//             backgroundColor: "transparent",
//             marginRight: 5,
//           }}
//         >
//           <Ionicons size={21} color="red" name="logo-google" />
//         </View>
//       </View>
//     )}
//   </TouchableNativeFeedback>
//   {/* <Button
//     color="black"
//     title="Login with Google"
//     onPress={signInWithGoogle}
//   />
//   <Ionicons size={21} color="red" name="logo-google" /> */}
// </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     marginTop: 20,
//     width: 150,
//     backgroundColor: "#000",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//     elevation: 5,
//     borderRadius: 5,
//   },
//   text: {
//     fontFamily: "open-sans",
//     fontSize: 18,
//     color: "#fff",
//   },
//   rowStyles: {
//     flexDirection: "row",
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#000",
//   },
// });

// export default LoginScreen;

import React, { useEffect, useState } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-community/google-signin";
import * as authActions from "../../store/actions/Auth";
import { useDispatch } from "react-redux";

const LoginScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // console.log(isLoading);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    GoogleSignin.configure({
      // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        "231876068069-7ddic513ebs2bjjep3r0o0if7560ce7o.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: "", // specifies a hosted domain restriction
      // loginHint: "", // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: "", // [Android] specifies an account name on the device that should be used
      // iosClientId:
      //   "231876068069-7ddic513ebs2bjjep3r0o0if7560ce7o.apps.googleusercontent.com", // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, []);
  const // Somewhere in your code
    signIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        // this.setState({ userInfo });
        const idToken = { userInfo };
        // console.log(idToken.userInfo.idToken);
        if (idToken.userInfo.idToken) {
          await dispatch(authActions.Googlelogin(idToken.userInfo.idToken));
          props.navigation.navigate("Shop");
        }
      } catch (error) {
        console.log({ error });
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          Alert.alert("SignIn canclled!", [{ text: "Okay" }]);

          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        } else {
          // some other error happened
        }
      }
    };
  return (
    <GoogleSigninButton
      style={{ width: 192, height: 48, marginTop: 10 }}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={signIn}
      // disabled={this.state.isSigninInProgress}
    />
  );
};

export default LoginScreen;
