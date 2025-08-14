import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
  };
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;
