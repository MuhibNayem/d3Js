<script>
	import { onMount } from 'svelte';

	import { drawSunburstChart } from '$lib/index.js';

	export let data;

	onMount(() => {
		drawSunburstChart(data);
	});
</script>

<div id="sunburst-chart"></div>

<style>
	#sunburst-chart {
		margin: 20px;
	}
</style>
