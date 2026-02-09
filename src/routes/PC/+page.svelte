<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { postImage } from '../../lib/nostr/post';
	import { dataURLtoFile } from '../../lib/utils/dataURLtoFile';

	//カメラを出すボタン
	let cameraBtn: HTMLButtonElement | undefined = undefined;

	//カメラの映像を流すvideoタグ
	let videoEl: HTMLVideoElement | undefined = undefined;
	//撮った写真を表示する枠
	let canvasEl: HTMLCanvasElement | undefined = undefined;
	//videoタグのストリーム
	let stream: MediaStream | null = null;
	//撮った写真のdataURL
	let photoUrl: string | null = null;

	//投稿内容を入力する場所
	let content: string | null = null;

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

	//カメラを起動する
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

	//カメラを撮影
	function takePhoto() {
		if (videoEl && canvasEl) {
			const context = canvasEl.getContext('2d');
			// ビデオの解像度に合わせてキャンバスのサイズを設定
			canvasEl.width = videoEl.videoWidth;
			canvasEl.height = videoEl.videoHeight;

			// 現在の映像をキャンバスに描画
			context?.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

			// 画像データURLに変換（プレビューや保存に使用）
			photoUrl = canvasEl.toDataURL('image/jpeg');

			stopCamera();
		}
	}

	//カメラを停止
	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	//カメラをリセット
	function reset() {
		photoUrl = null;
	}

	//投稿ボタンを押されたとき
	function post_btn_clicked() {
		if (!photoUrl) return;

		let cont: string = content ?? '';

		let filename = 'nosnap';

		let imageFile: File = dataURLtoFile(photoUrl, filename + Math.floor(Date.now() / 1000));

		try {
			const post_url = postImage(imageFile, cont);

			alert('投稿しました');
			reset();
		} catch (error) {
			console.error('投稿エラー:', error);
			alert('投稿に失敗');
		}
	}
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
		<p class="mb-1">
			画像と一緒に投稿する内容：<br />
			<textarea name="comment" cols="50" rows="5" bind:value={content}></textarea>
		</p>
		<div class="mb-5 text-center">
			<button class="btn-camera" on:click={post_btn_clicked}> 投稿 </button>
		</div>
	</div>
{/if}

<style>
</style>
