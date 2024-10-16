<script>
	import { page } from '$app/stores';

	let pathname;

	$: {
		pathname = $page.url.pathname;
	}
</script>

<nav>
	<a href="/barChart" class={pathname === '/barChart' ? 'active' : ''}>Bar Chart</a>
	<a href="/pieChart" class={pathname === '/pieChart' ? 'active' : ''}>Pie Chart</a>
	<a href="/sunburstChart" class={pathname === '/sunburstChart' ? 'active' : ''}>Sunburst Chart</a>
</nav>

<slot></slot>

<style>
	nav {
		background-color: #333;
		padding: 10px;
		text-align: center;
	}

	nav a {
		color: #fff;
		text-decoration: none;
		padding: 10px 20px;
		margin: 0 5px;
		font-size: 16px;
		transition:
			background-color 0.3s,
			color 0.3s;
		border-radius: 5px;
	}

	nav a:hover {
		background-color: #555;
		color: rgb(255, 111, 0);
	}

	nav a.active {
		background-color: #255;
		color: rgb(255, 255, 255);
	}
</style>
