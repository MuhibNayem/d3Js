<script>
	import { onMount } from 'svelte';

	import { drawPieChart } from '$lib/index.js';

	export let data;

	onMount(() => {
		drawPieChart(data?.data);
	});
</script>

<div id="pie-chart"></div>

<style>
	#pie-chart {
		margin: 20px;
	}
</style>
