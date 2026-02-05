<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import { base } from '$app/paths';

	// bind:this を使うことで、getElementById も nullチェックも不要になります
	let videoEl: HTMLVideoElement;

	onMount(() => {
		// 簡易的なスマホ判定（正規表現）
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

		if (!isMobile) {
			goto(`${base}/PC/`); // スマホ用ページへ飛ばす
		}
	});

	// マウント時に自動でカメラを起動したい場合はここ
	// onMount(() => { startCamera(); });
</script>

<h1>ノスナップ スマホ版</h1>

<div>
	<input type="file" capture="environment" accept="image/*" />
</div>
