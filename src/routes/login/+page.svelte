<script lang="ts">
	import { onMount } from 'svelte';
	import { LoginWithNip07, LoginWithSeckey } from '../../lib/nostr/auth/login';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let nip07Btn: HTMLButtonElement;
	let keyBtn: HTMLButtonElement;

	let isKeyDisabled: boolean = true;

	let nsecInputText: string = '';

	let isNip07Disabled: boolean = window.nostr == undefined;
	console.log(window.nostr);

	$: isValidNsec = /^nsec1[a-z0-9]{58}$/.test(nsecInputText);
	$: isKeyDisabled = !isValidNsec;

	function Nip07Login() {
		LoginWithNip07();

		goto(resolve('/'));
	}

	function InputLogin() {
		LoginWithSeckey(nsecInputText);
		goto(resolve('/'));
	}
</script>

<h1 class="mb-5 text-center text-4xl">ノスナップ</h1>

<div class="mr-auto ml-auto w-19/20 bg-gray-200 p-5">
	<h2>ノスナップとは？</h2>
	<p>
		スマホでその場で撮影した写真をその場で投稿するためのクライアント！<br />
		あなたの思い出を今すぐNostrで共有しよう！
	</p>

	<div class="login-form">
		<button class="btn-primary" disabled={isNip07Disabled} on:click={Nip07Login}
			>NIP-07(拡張機能)でログイン</button
		>
		<button class="btn-primary w-1/1" disabled={isKeyDisabled} on:click={InputLogin}>
			秘密鍵でログイン
		</button>
		<input class="" placeholder="秘密鍵を入力(nsec......)" bind:value={nsecInputText} />
	</div>
</div>

<style lang="scss">
	.login-form {
		text-align: center;

		button {
			width: 95%;
		}

		input {
			width: 95%;
		}
	}
</style>
