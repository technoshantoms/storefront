import { type ActionAPIContext, ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { getProductById } from 'storefront:client';
import { loadCartFromCookies, saveCartToCookies } from '~/features/cart/cart.server.ts';
import {
	type Cart,
	addItemToCart,
	expandLineItem,
	lineItemDataSchema,
	normalizeCart,
	removeItemFromCart,
	updateCartItemQuantity,
} from '~/features/cart/cart.ts';
import { productIdFromVariantId } from '~/lib/util.ts';

export const cart = {
	get: defineAction({
		handler: (_, ctx) => getCart(ctx),
	}),
	addItems: defineAction({
		input: lineItemDataSchema.omit({ id: true }),
		handler: async (input, ctx) => {
			const productId = productIdFromVariantId(input.productVariantId);
			const productResponse = await getProductById({ path: { id: productId } });
			const product = productResponse.data;

			if (!product) {
				throw new ActionError({
					code: 'NOT_FOUND',
					message: `Failed to find product with variant ID "${input.productVariantId}"`,
				});
			}

			const lineItem = expandLineItem({ ...input, id: crypto.randomUUID() }, product);

			if (lineItem.quantity > lineItem.productVariant.stock) {
				throw new ActionError({
					code: 'BAD_REQUEST',
					message: 'Not enough stock',
				});
			}

			const cart = await getCart(ctx);
			setCart(ctx, addItemToCart(cart, lineItem));
		},
	}),
	deleteItem: defineAction({
		input: z.object({
			id: z.string(),
		}),
		handler: async (input, ctx) => {
			const cart = await getCart(ctx);
			setCart(ctx, removeItemFromCart(cart, input.id));
		},
	}),
	updateItem: defineAction({
		input: z.object({
			id: z.string(),
			quantity: z.number().int().min(1).max(20),
		}),
		handler: async (input, ctx) => {
			const cart = await getCart(ctx);
			setCart(ctx, updateCartItemQuantity(cart, input.id, input.quantity));
		},
	}),
};

async function getCart(ctx: ActionAPIContext): Promise<Cart> {
	return normalizeCart(await loadCartFromCookies(ctx.cookies));
}

function setCart(ctx: ActionAPIContext, cart: Cart): void {
	saveCartToCookies(cart, ctx.cookies);
}
