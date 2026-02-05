<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// bind:this を使うことで、getElementById も nullチェックも不要になります
	let videoEl: HTMLVideoElement;

	onMount(() => {
		// 簡易的なスマホ判定（正規表現）
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

		if (isMobile) {
			goto('/'); // スマホ用ページへ飛ばす
		}
	});

	async function startCamera() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user' }
			});
			// videoEl はこの時点で必ず存在するので安全
			videoEl.srcObject = stream;
		} catch (error) {
			console.error('カメラの起動に失敗しました', error);
		}
	}

	// マウント時に自動でカメラを起動したい場合はここ
	// onMount(() => { startCamera(); });
</script>

<h1>ノスナップPC版</h1>

<div>
	<button onclick={startCamera}>カメラを起動</button>
</div>

<video bind:this={videoEl} width="640" height="480" autoplay playsinline></video>
