<script>
	import { onMount } from 'svelte';

	import { drawBarChart } from '$lib/index.js';

	export let data;

	onMount(() => {
		drawBarChart(data?.data);
	});
</script>

<div id="bar-chart"></div>

<style>
	#bar-chart {
		margin: 20px;
	}
</style>
