export const cartParser = ({cart}) => (
        cart.cartItems.map(cartItem=> (
            {
                'productId': cartItem.productId,
                'variantId': cartItem.variantId,
                'qty': cartItem.qty
            })
        )
)


