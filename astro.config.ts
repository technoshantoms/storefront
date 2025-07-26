import netlify from '@astrojs/netlify';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig, envField } from 'astro/config';
import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind({ applyBaseStyles: false }), icon(), solidJs(), db()],
	// Update to your storefront URL
	site: 'https://shop.astro.build',
	output: 'server',
	adapter: netlify({ imageCDN: true }),
	vite: {
		build: {
			assetsInlineLimit(filePath) {
				return filePath.endsWith('css');
			},
		},
	},
	image: {
		// Update to your own image domains
		domains: [
			'localhost',
			'shop-next.astro.build',
			'shop.astro.build',
			'main--astro-swag-shop.netlify.app',
		],
	},
	experimental: {
		env: {
			schema: {
				STRIPE_SECRET_KEY: envField.string({
					context: 'server',
					access: 'secret',
					// This is a random test key
					default: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
				}),
				FATHOM_SITE_ID: envField.string({
					context: 'client',
					access: 'public',
					optional: true,
				}),
				GOOGLE_GEOLOCATION_SERVER_KEY: envField.string({
					context: 'server',
					access: 'secret',
					optional: true,
				}),
				GOOGLE_MAPS_BROWSER_KEY: envField.string({
					context: 'client',
					access: 'public',
					optional: true,
				}),
				LOOPS_API_KEY: envField.string({
					context: 'server',
					access: 'secret',
					optional: true,
				}),
				LOOPS_SHOP_TRANSACTIONAL_ID: envField.string({
					context: 'server',
					access: 'public',
					optional: true,
				}),
				LOOPS_FULFILLMENT_TRANSACTIONAL_ID: envField.string({
					context: 'server',
					access: 'public',
					optional: true,
				}),
				LOOPS_FULFILLMENT_EMAIL: envField.string({
					context: 'server',
					access: 'public',
					optional: true,
				}),
				US_SHIPPING_RATE_ID: envField.string({
					context: 'server',
					access: 'secret',
					// This is a random ID
					default: 'mw5TYW8Dnlh56TRWKan',
				}),
				INTERNATIONAL_SHIPPING_RATE_ID: envField.string({
					context: 'server',
					access: 'secret',
					// This is a random test key
					default: 'miH7VKjht1sYabCgaY1',
				}),
			},
		},
	},
});
