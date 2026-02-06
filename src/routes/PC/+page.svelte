<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	let cameraBtn: HTMLButtonElement | undefined = undefined;

	let videoEl: HTMLVideoElement | undefined = undefined;

	onMount(() => {
		// 簡易的なスマホ判定（正規表現）
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

		if (isMobile) {
			goto(`${base}/`); // スマホ用ページへ飛ばす
		}
	});

	async function startCamera() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user' }
			});

			if (videoEl != undefined) {
				videoEl.srcObject = stream;
			}
		} catch (error) {
			console.error('カメラの起動に失敗しました', error);
		}
	}

	// マウント時に自動でカメラを起動したい場合はここ
	// onMount(() => { startCamera(); });
</script>

<h1 class="mb-5 text-center text-4xl">ノスナップPC版</h1>

<div class="text-center">
	<button class="btn-camera" bind:this={cameraBtn} on:click={startCamera}> カメラを起動 </button>
</div>

<video
	bind:this={videoEl}
	class="mr-auto ml-auto w-2/3 -scale-x-100 pt-20"
	height="800"
	autoplay
	playsinline
	muted
></video>

<style>
</style>
