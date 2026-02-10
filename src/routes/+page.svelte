<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { postImage } from '../lib/nostr/post';

	let fileInput: HTMLInputElement | null = null;
	let photo: File | null;
	let photoUrl: string | null = null;
	let canvasEl: HTMLCanvasElement;

	//投稿内容を入力する場所
	let content: string | null = null;

	// 写真がセットされたら実行されるリアクティブ宣言
	$: if (photo) {
		photoUrl = URL.createObjectURL(photo);
		console.log(photoUrl);
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement | null;
		if (target?.files && target.files.length > 0) {
			photo = target.files[0];
		}
	}

	//カメラをリセット
	function reset() {
		photo = null;
		photoUrl = null;
	}

	//投稿ボタンを押されたとき
	function post_btn_clicked() {
		if (!photo) return;

		let cont: string = content ?? '';

		let filename = 'nosnap';

		let imageFile: File = photo;

		try {
			postImage(imageFile, cont);

			alert('投稿しました');
			reset();
		} catch (error) {
			console.error('投稿エラー:', error);
			alert('投稿に失敗');
		}
	}

	onMount(() => {
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

		if (!isMobile) {
			const URL = resolve('/PC/');
			goto(URL);
		}
	});
</script>

<h1 class="mb-5 text-center text-4xl">ノスナップ スマホ版</h1>

<div class="text-center">
	<label class="custom-camera-btn">
		カメラで撮影！
		<input
			bind:this={fileInput}
			type="file"
			capture="environment"
			accept="image/*"
			style="display:none;"
			on:change={handleFileChange}
		/>
	</label>
</div>

{#if photoUrl}
	<div class="mt-10 text-center">
		<h2 class="mb-2 text-xl">撮れた写真</h2>
		<img src={photoUrl} alt="Captured" class="mx-auto max-w-xs border-4 border-white shadow-lg" />
		<p class="mb-1">
			画像と一緒に投稿する内容：<br />
			<textarea
				name="comment"
				class="mx-auto h-full max-h-64 max-w-xs"
				cols="50"
				rows="5"
				bind:value={content}
			></textarea>
		</p>
		<div class="mb-5 text-center">
			<button class="btn-camera" on:click={post_btn_clicked}> 投稿 </button>
		</div>
	</div>
{/if}

<style>
	.custom-camera-btn {
		display: inline-block;
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border-radius: 5px;
		cursor: pointer;
		font-weight: bold;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
	}

	.custom-camera-btn:hover {
		background-color: #0056b3;
	}
</style>
