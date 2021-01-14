import { ADD_TO_WISH, REMOVE_WISH, SET_WISH } from "../actions/wish";
import Product from "../../modals/Products";

const initialState = {
  wish: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_WISH:
      return {
        wish: action.wish,
      };
    case ADD_TO_WISH:
      const newItem = new Product(
        action.product.id,
        action.product.ownerId,
        action.product.title,
        action.product.imageUrl,
        action.product.description,
        action.product.price,
        action.product.imgName,
        action.product.isfeatured,
        action.product.inStock,
        action.product.oldprice
      );
      return {
        wish: state.wish.concat(newItem),
      };
    case REMOVE_WISH:
      return {
        wish: state.wish.filter((el) => el.id !== action.pid),
      };
  }
  return state;
};
