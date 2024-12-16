import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
	plugins: [solid()],
	build: {
		rollupOptions: {
			output: {
				assetFileNames: '[name]-[hash][extname]',
				chunkFileNames: '[name]-[hash].js',
				entryFileNames: '[name]-[hash].js'
			}
		}
	}
})
