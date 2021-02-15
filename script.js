//! CONSTS
const width = document.documentElement.clientWidth * 0.9;
const height = document.documentElement.clientHeight * 0.666;
const padding = 40;
const barHeight = height / 100;
const barWidth = (width - padding) / 280;

//! SVG
const svg =
  d3.select('.chart-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

let dataset;

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  (e, json) => {

    dataset = json.data.map((item) => {
    return [new Date(moment.tz(item[0], "America/New_York")), item[1]]
  })

  const sliceYear = (date) => moment(date).format('Y-MM-DD')
  // const dateset = json.data.map((item, i) => [item[0], item[1]])


  //! X
  const xScale =
    d3.scaleTime()
      .domain([d3.min(dataset, (d) => d[0]), d3.max(dataset, (d) => d[0])])
      // .domain([0, dataset.length])
      .range([padding, width - padding]);
  //! Y
  const yScale =
    d3.scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([height - padding, padding]);

  // !AXIS
  const xAxis =
    d3.axisBottom()
      .scale(xScale)
      .tickFormat(d3.timeFormat("%Y"))

  const yAxis =
    d3.axisLeft()
      .scale(yScale);

  //! TOOLTIP
  const tooltip = d3.select('.chart-container')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

  const mainXaxis = svg
    .append('g')
    .attr("transform", `translate(0,${height - padding})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  const mainYaxis = svg
    .append('g')
    .attr("transform", `translate(${padding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);


  //! BARS

  const bars = mainYaxis
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => xScale(d[0]) - padding)
    .attr('y', (d, i) => yScale(d[1]) - padding)
    .attr("transform", `translate(0, ${padding})`)
    .attr('width', barWidth)
    .attr('height', (d, i) => height - yScale(d[1]) - padding)
    .attr('data-date', (d, i) => sliceYear(d[0])) //? to handling with timezone conflicts without external libs
    .attr('data-gdp', (d, i) => d[1])
    .on('mouseover', (event, d) => {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', .9)
        .attr('data-date', sliceYear(event[0]))
      tooltip
        .html(`
          ${sliceYear(event[0])}
          <br />
          $${event[1]} billions
        `)
        .style('left', `${event.screenX - padding}px`)
        .style('top', `${event.screenY - padding - 30}px`)
    })
    .on('mouseout', () => {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0)
    })


});


    