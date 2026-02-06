<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let fileInput: HTMLInputElement | null = null;

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement | null;
		if (target?.files && target.files.length > 0) {
			const photo = target.files[0];
			// ここで photo を処理
		}
	}

	onMount(() => {
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

		if (!isMobile) {
			const URL = resolve('/PC/');
			goto(URL); // スマホ用ページへ飛ばす
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
