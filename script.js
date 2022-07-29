//to make sure d3 is imported
//console.log(d3) 
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
// importing the url
let req = new XMLHttpRequest()
//data will have all the data 
let data
//values will have only elements from the data that we need[data.data]
let values

//creating scales
let heightScale

let xScale

let xAxisScale

let yAxisScale

//dimensions for the canvas
let width = 800
let height = 600
let padding = 40

//drawing items into svg
let svg = d3.select('svg')

//setting height and width of an svg area
let drawCanvas = () => {
    svg.attr('width',width)
    svg.attr('height',height)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
    // the lowest value will be the minimum GDP which (in this case) is 0
                .domain([0,d3.max(values,(item) => {
                    return item[1]
                })])
                .range([0,height - (2*padding)])

    xScale = d3.scaleLinear()
                .domain([0,values.length-1])
                .range([padding, width - padding])
    //strings ==> datetime objects
    let datesArray = values.map( (item) => {
        return new Date(item[0])
    })

    //console.log(datesArray)
 
    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0,d3.max(values, (item)=>{
                        return item[1]
                    })])
                    .range([height-padding, padding])
}

let drawBars = () => {
    //creating a tooltip
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id','tooltip')
                    //.style because we are working with CSS, not svg
                    .style('visibility','hidden')
                    .style('height','auto')
                    .style('width','auto')
    svg.selectAll('rect')
        .data(values) //associates all rectangles(even if they don't exist) in the svg area with the values array
        .enter()
        .append('rect')
        .attr('class','bar')
        //width of each bar
        .attr('width',(width - ( 2*padding ))/values.length )
        .attr('data-date',(item) => {
            return item[0]
        })
        .attr('data-gdp',(item) => {
            return item[1]
        })
        .attr('height',(item) => {
            return heightScale(item[1])
        })
        //user story 10
        .attr('x',(item,index) => {
            return xScale(index)
        })
        //user sotry 11. Transform the bar upside down to be correctly positioned on the y-axis
        .attr('y',(item) => {
            return (height-padding) - heightScale(item[1])
        })

        //tooltip on/off toggle
        .on('mouseover',(event,item) => {
            tooltip.transition()
                    .style('visibility','visible')
            tooltip.text(item[0])
            //user story 14
            document.querySelector('#tooltip').setAttribute('data-date',item[0])
        })
        .on('mouseout',(event,item) => {
            tooltip.transition()
                .style('visibility','hidden')
            
        })


}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append('g')
        .call(xAxis)
        .attr('id','x-axis')
        //push it down to the bottom
        .attr('transform','translate(0,'+ (height - padding)+')')

    let yAxis = d3.axisLeft(yAxisScale)
    svg.append('g')
        .call(yAxis)
        .attr('id','y-axis')
        //push it to the right by padding
        .attr('transform','translate('+ padding + ',0)')
}

//opening the request to import the JSON data
req.open('GET',url,true)
req.onload = () => {
    //console.log(req.responseText)
    data = JSON.parse(req.responseText)
    //[data.data]
    values = data.data
    console.log(values)
    //lines 50-53 extract data that will be used on the graph from the bigger JSOn response
    //next, functions that will be used to build the graph are listed in the correct order 
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()

}
req.send()