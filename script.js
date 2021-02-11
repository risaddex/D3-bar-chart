
const xScale = d3
.scaleLinear()
.domain([50, 150])
.range([0, 300])

const output = xScale(100)

const xAxis = d3.axisLeft(xScale)
const svg = d3
  .select('.chart-container')
  .append('svg')  
  .attr('width', 500)
  .attr('height', 300)
  .call(xAxis)

  
  
