import adapter from '@sveltejs/adapter-static'; // adapter-autoから変更
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build', // ビルド先のフォルダ
			assets: 'build',
			fallback: '404.html', // SPAとして動かすなら重要
			precompress: false,
			strict: true
		}),
		paths: {
			// ユーザー名.github.io/リポジトリ名/ の形式なら以下が必要
			// base: process.env.NODE_ENV === 'production' ? '/リポジトリ名' : '',
		}
	}
};

export default config;