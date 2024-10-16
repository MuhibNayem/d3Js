import * as d3 from 'd3';

export const drawPieChart = (pieChartData) => {
	const width = 928;
	const height = Math.min(width, 500);

	const color = d3
		.scaleOrdinal()
		.domain(pieChartData.map((d) => d.name))
		.range(
			d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), pieChartData.length).reverse()
		);

	const pie = d3
		.pie()
		.sort(null)
		.value((d) => d.value);

	const arc = d3
		.arc()
		.innerRadius(0)
		.outerRadius(Math.min(width, height) / 2 - 1);

	const labelRadius = arc.outerRadius()() * 0.8;

	const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

	const arcs = pie(pieChartData);

	const svg = d3
		.select('#pie-chart')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', [-width / 3, -height / 2, width, height])
		.attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

	svg
		.append('g')
		.attr('stroke', 'white')
		.selectAll()
		.data(arcs)
		.join('path')
		.attr('fill', (d) => color(d.data.name))
		.attr('d', arc)
		.append('title')
		.text((d) => `${d.data.name}: ${d.data.value.toLocaleString('en-US')}`);

	svg
		.append('g')
		.attr('text-anchor', 'middle')
		.selectAll()
		.data(arcs)
		.join('text')
		.attr('transform', (d) => `translate(${arcLabel.centroid(d)})`)
		.call((text) =>
			text
				.append('tspan')
				.attr('y', '-0.4em')
				.attr('font-weight', 'bold')
				.text((d) => d.data.name)
		)
		.call((text) =>
			text
				.filter((d) => d.endAngle - d.startAngle > 0.25)
				.append('tspan')
				.attr('x', 0)
				.attr('y', '0.7em')
				.attr('fill-opacity', 0.7)
				.text((d) => d.data.value.toLocaleString('en-US'))
		);
};

export const drawBarChart = (barChartData) => {
	const width = 928;
	const height = 500;
	const margin = { top: 20, right: 30, bottom: 40, left: 40 };

	const x = d3
		.scaleBand()
		.domain(
			d3.groupSort(
				barChartData,
				([d]) => -d.frequency,
				(d) => d.letter
			)
		)
		.range([margin.left, width - margin.right])
		.padding(0.1);

	const y = d3
		.scaleLinear()
		.domain([0, d3.max(barChartData, (d) => d.frequency)])
		.range([height - margin.bottom, margin.top]);

	const svg = d3
		.select('#bar-chart')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', [0, 0, width, height])
		.attr('style', 'max-width: 100%; height: auto;');

	// Add a rect for each bar.
	svg
		.append('g')
		.attr('fill', 'steelblue')
		.selectAll()
		.data(barChartData)
		.join('rect')
		.attr('x', (d) => x(d.letter))
		.attr('y', (d) => y(d.frequency))
		.attr('height', (d) => y(0) - y(d.frequency))
		.attr('width', x.bandwidth());

	// Add the x-axis and label.
	svg
		.append('g')
		.attr('transform', `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x).tickSizeOuter(0));

	// Add the y-axis and label, and remove the domain line.
	svg
		.append('g')
		.attr('transform', `translate(${margin.left},0)`)
		.call(d3.axisLeft(y).tickFormat((y) => (y * 100).toFixed()))
		.call((g) => g.select('.domain').remove())
		.call((g) =>
			g
				.append('text')
				.attr('x', -margin.left)
				.attr('y', 10)
				.attr('fill', 'currentColor')
				.attr('text-anchor', 'start')
				.text('↑ Frequency (%)')
		);
};

export const drawSunburstChart = (sunburstData) => {
	const width = 928;
	const height = 928;

	// Specify the chart’s colors and approximate radius (it will be adjusted at the end).
	const color = d3.scaleOrdinal(
		d3.quantize(d3.interpolateRainbow, sunburstData.children.length + 1)
	);
	const radius = 928 / 2;

	// Prepare the layout.
	const partition = (data) =>
		d3.partition().size([2 * Math.PI, radius])(
			d3
				.hierarchy(data)
				.sum((d) => d.value)
				.sort((a, b) => b.value - a.value)
		);

	const arc = d3
		.arc()
		.startAngle((d) => d.x0)
		.endAngle((d) => d.x1)
		.padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
		.padRadius(radius / 2)
		.innerRadius((d) => d.y0)
		.outerRadius((d) => d.y1 - 1);

	const root = partition(sunburstData);

	// Create the SVG container.
	const svg = d3
		.select('#sunburst-chart')
		.append('svg')
		.attr('width', width)
		.attr('viewBox', [-width / 2.3, -height / 2, width, height])
		.attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

	// Add an arc for each element, with a title for tooltips.

	// Create a tooltip div that is hidden by default
	const tooltip = d3
		.select('#sunburst-chart')
		.append('div')
		.style('position', 'absolute')
		.style('visibility', 'hidden')
		.style('background-color', 'white')
		.style('border', 'solid 1px #ccc')
		.style('border-radius', '4px')
		.style('padding', '8px')
		.style('font-size', '12px')
		.style('pointer-events', 'none');

	const format = d3.format(',d');

	// Modify the path selection to show the tooltip on hover
	svg
		.selectAll('path')
		.data(root.descendants().filter((d) => d.depth))
		.join('path')
		.attr('fill', (d) => {
			while (d.depth > 1) d = d.parent;
			return color(d.data.name);
		})
		.attr('d', arc)
		.on('mouseover', function (_, d) {
			tooltip.style('visibility', 'visible').text(
				`${d
					.ancestors()
					.map((d) => d.data.name)
					.reverse()
					.join(' > ')}\n${'='}\n${format(d.value)}`
			);
		})
		.on('mousemove', function (event) {
			tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
		})
		.on('mouseout', function () {
			tooltip.style('visibility', 'hidden');
		});

	// Add a label for each element.
	svg
		.append('g')
		.attr('pointer-events', 'none')
		.attr('text-anchor', 'middle')
		.attr('font-size', 10)
		.attr('font-family', 'sans-serif')
		.selectAll('text')
		.data(root.descendants().filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10))
		.join('text')
		.attr('transform', function (d) {
			const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
			const y = (d.y0 + d.y1) / 2;
			return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
		})
		.attr('dy', '0.35em')
		.text((d) => d.data.name);
};
