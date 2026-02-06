<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let cameraBtn: HTMLButtonElement | undefined = undefined;

	let videoEl: HTMLVideoElement | undefined = undefined;
	let canvasEl: HTMLCanvasElement | undefined = undefined;
	let stream: MediaStream | null = null;
	let photoUrl: string | null = null;

	onMount(() => {
		// 簡易的なスマホ判定（正規表現）
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

		if (isMobile) {
			const URL = resolve('/');
			goto(URL); // スマホ用ページへ飛ばす
		}
	});

	async function startCamera() {
		reset();
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user' }
			});

			if (videoEl != undefined) {
				videoEl.srcObject = stream;
			}
		} catch (error) {
			console.error('カメラの起動に失敗しました', error);
		}
	}

	function takePhoto() {
		if (videoEl && canvasEl) {
			const context = canvasEl.getContext('2d');
			// ビデオの解像度に合わせてキャンバスのサイズを設定
			canvasEl.width = videoEl.videoWidth;
			canvasEl.height = videoEl.videoHeight;

			// 鏡面処理している場合は、キャンバスも反転させる
			context?.translate(canvasEl.width, 0);
			context?.scale(-1, 1);

			// 現在の映像をキャンバスに描画
			context?.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

			// 画像データURLに変換（プレビューや保存に使用）
			photoUrl = canvasEl.toDataURL('image/jpeg');

			stopCamera();
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	function reset() {
		photoUrl = null;
		// 必要ならここで再度カメラを自動起動
		// startCamera();
	}

	// マウント時に自動でカメラを起動したい場合はここ
	// onMount(() => { startCamera(); });
</script>

<h1 class="mb-5 text-center text-4xl">ノスナップPC版</h1>

<div class="mb-5 text-center">
	<button class="btn-camera" bind:this={cameraBtn} on:click={startCamera}> カメラを起動 </button>
</div>

<div class="mb-5 text-center">
	<button class="btn-camera" on:click={takePhoto} disabled={!videoEl?.srcObject}>
		シャッターを切る
	</button>
</div>

{#if !photoUrl}
	<video
		bind:this={videoEl}
		class="mr-auto ml-auto w-1/2 -scale-x-100 pt-20"
		height="800"
		autoplay
		playsinline
		muted
	></video>
{/if}

<canvas bind:this={canvasEl} class="hidden"></canvas>

{#if photoUrl}
	<div class="mt-10 text-center">
		<h2 class="mb-2 text-xl">撮れた写真</h2>
		<img src={photoUrl} alt="Captured" class="mx-auto max-w-sm border-4 border-white shadow-lg" />
		<a href={photoUrl} download="snap.png" class="mt-4 inline-block text-blue-500 underline">
			画像を保存する
		</a>
	</div>
{/if}

<style>
</style>
