export const ADD_TO_WISH = "ADD_TO_WISH";
export const REMOVE_WISH = "REMOVE_WISH";
export const SET_WISH = "SET_WISH";
import Product from "../../modals/Products";

export const setWish = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const loadedWish = [];

    try {
      const response = await fetch(
        `https://e-commerce-app-b62a8.firebaseio.com/Wishlist/${userId}.json?auth=${token}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong in getWish");
      }
      const resData = await response.json();
      console.log(resData);
      for (const key in resData) {
        for (const newkey in resData[key]) {
          loadedWish.push(
            new Product(
              resData[key][newkey].product.id,
              resData[key][newkey].product.ownerId,
              resData[key][newkey].product.title,
              resData[key][newkey].product.imageUrl,
              resData[key][newkey].product.description,
              resData[key][newkey].product.price,
              resData[key][newkey].product.imgName,
              resData[key][newkey].product.isfeatured,
              resData[key][newkey].product.inStock,
              resData[key][newkey].product.oldprice
            )
          );
        }
      }
    } catch (err) {
      console.log(err.message);
    }
    dispatch({ type: SET_WISH, wish: loadedWish });
  };
};

export const addtoWish = (product) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;

    const response = await fetch(
      `https://e-commerce-app-b62a8.firebaseio.com/Wishlist/${userId}/${product.id}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const resData = await response.json();
    console.log(resData);

    dispatch({ type: ADD_TO_WISH, product: product });
  };
};

export const removeWish = (pid) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const response = await fetch(
      `https://e-commerce-app-b62a8.firebaseio.com/Wishlist/${userId}/${pid}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong!!");
    }
    dispatch({ type: REMOVE_WISH, pid: pid });
  };
};
