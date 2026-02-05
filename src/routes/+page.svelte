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
            console.log(base)
			//goto(`${base}/PC/`); // スマホ用ページへ飛ばす
		}
	});

	// マウント時に自動でカメラを起動したい場合はここ
	// onMount(() => { startCamera(); });
</script>

<h1>ノスナップ スマホ版</h1>

<div>
    <label class="custom-camera-btn">
    カメラで撮影！
    <input type="file" capture="environment" accept="image/*" style="display:none;">
    </label>
</div>

<style>
.custom-camera-btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff; /* 好きなボタンの色 */
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

.custom-camera-btn:hover {
    background-color: #0056b3; /* ホバー時の色 */
}
</style>