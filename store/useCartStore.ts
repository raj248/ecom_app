// stores/useCartStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product, Variant } from '~/models/Product';
import { CartItem } from '~/models/Order'; // or wherever you keep CartItem type
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartState {
  cart: CartItem[];

  // actions
  addToCart: (product: Product, variant?: Variant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  removeAllFromCart: (productId: string, variantId?: string) => void;
  emptyCart: () => void;

  // selectors
  getCart: () => CartItem[];
  getTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, variant) => {
        set((state) => {
          const key = variant ? `${product._id}-${variant.sku || variant.barcode}` : product._id;
          const existingItem = state.cart.find(
            (item) =>
              item._id === product._id &&
              (!variant ||
                item.variant?.sku === variant.sku ||
                item.variant?.barcode === variant.barcode)
          );

          if (existingItem) {
            // console.log('Updating cart item:', existingItem);
            return {
              cart: state.cart.map((item) =>
                item._id === product._id &&
                (!variant ||
                  item.variant?.sku === variant.sku ||
                  item.variant?.barcode === variant.barcode)
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                      itemTotal: (item.quantity + 1) * item.price,
                    }
                  : item
              ),
            };
          }

          const price = variant ? variant.price : product.prices.price;
          const originalPrice = variant ? variant.originalPrice : product.prices.originalPrice;

          const newItem: CartItem = {
            ...product,
            price,
            originalPrice,
            quantity: 1,
            itemTotal: price,
            variant,
          };
          //   console.log('Adding to cart:', newItem);
          return { cart: [...state.cart, newItem] };
        });
      },

      removeFromCart: (productId, variantId) => {
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item._id === productId &&
              (!variantId || item.variant?.sku === variantId || item.variant?.barcode === variantId)
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    itemTotal: (item.quantity - 1) * item.price,
                  }
                : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      removeAllFromCart: (productId, variantId) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item._id === productId &&
                (!variantId ||
                  item.variant?.sku === variantId ||
                  item.variant?.barcode === variantId)
              )
          ),
        }));
      },

      emptyCart: () => set({ cart: [] }),

      getCart: () => get().cart,

      getTotal: () => get().cart.reduce((sum, item) => sum + item.itemTotal, 0),

      getCartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage', // storage key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // ✅ required in React Native
    }
  )
);
