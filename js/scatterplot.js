
function scatterplot() {


    //Added this on 10-Sep-2018 to clear screen as new points after adding filter would just plot on top of old one. Fix to clear old graph
    d3
        .select("#vis_canvas")
        .selectAll("*")
        .remove();
    d3
        .select("#vis_canvas2")
        .selectAll("*")
        .remove();




// set the dimensions and margins of the graph
    d3.csv('./data/10yearAUSOpenMatches.csv', function (data) {
        data.forEach(function(d) {

            d.winner1 = +d.winner1;
            d.winner2 = +d.winner2;

        });

        // Variables
        var mycanvas = d3.select('#vis_canvas')
        var margin = { top: 70, right: 50, bottom: 70, left: 50 }
        var page=document.getElementById("vis_canvas")
        var h = 400;//page.clientWidth-600//500 - margin.top - margin.bottom
        var w = 400;//page.clientWidth-600//500 - margin.left - margin.right
        console.log(h+'X'+w)

        var filterYear=document.getElementById('select_year').value;
        var filterRound=document.getElementById('select_round').value;


        // Standard Scale to define ddomain and range
        var backcolor = d3.scale.category20()
        var xScale = d3.scale.linear()
            .domain([
                d3.min([d3.min(data,function (d) {
                    return d.winner1
                })])/ 1.05,
                d3.max([0,d3.max(data,function (d) {
                    return d.winner1
                })*1.05])

            ])
            .range([d3.min(data,function (d) {
                return d.winner1
            }),w])
        var yScale = d3.scale.linear()
            .domain([
                d3.min([d3.min(data,function (d) {
                    return d.winner2
                })]),
                d3.max([d3.max(data,function (d) {
                    return d.winner2
                })])
            ])
            .range([h,0])

        var svg = mycanvas.append('svg')
            .attr('height',h + margin.top + margin.bottom)
            .attr('width',w + margin.left + margin.right)
            .append('g')
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
        // X-axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(15);
        // Y-axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')

        // points that represent data points of each match
        var points = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .filter(function(d) {                                   //Part2: Added filtering condition on 09-Sep-2018 to provide yearly view of data
                if(filterYear==='all'){
                    return d.year;
                }
                else {
                    return d.year === filterYear ? this : null;
                }
            })
            .filter(function(d) {                                   //Part2: Added filtering condition on 10-Sep-2018 to provide yearly view of data
                if(filterRound==='all'){
                    return d.round;
                }
                else {
                    return d.round === filterRound ? this : null;
                }
            })
            .attr('cx',function (d) { return xScale(d.winner1) })
            .attr('cy',function (d) { return yScale(d.winner2) })
            .attr('r','5')
            .attr('stroke','black')
            .attr('stroke-width',1)
            .attr('fill',function (d,i) { return backcolor(0) })
            .on('click',function(d){
                linegraph(d);
                 barchart(d);
            })
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',10)
                    .attr('stroke-width',3)
                    .enter()
                    .append("text")
                    .text(function(d) {return 'Player 1:'+d.player1+'\nPlayer 2:'+d.player2+'\nwinner1:'+d.winner1+'\nwinner2:'+d.winner2;})

            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',5)
                    .attr('stroke-width',1)
            })
            .append('title')
            .text(function (d) { return 'Player 1:'+d.player1+'\nPlayer 2:'+d.player2+'\nwinner 1: '+ d.winner1 +
                '\nwinner 2: ' + d.winner2 })



        // X-axis
        svg.append('g')
            .attr('class','axis')
            .attr('transform', 'translate(0,' + h + ')')
            .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px','font-size':'12px'})
            .call(xAxis)
            .append('text') // X-axis Label
            .attr('class','label')
            .attr('y',-10)
            .attr('x',w)
            .attr('dx','.71em')
            .style('text-anchor','end')
            .text('winner Points by Player 1')
        // Y-axis
        svg.append('g')
            .attr('class', 'axis')
            .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px','font-size':'12px'})
            .call(yAxis)
            .append('text') // y-axis Label
            .attr('class','label')
            .attr('transform','rotate(-90)')
            .attr('x',0)
            .attr('y',1)
            .attr('dy','.71em')
            .style('text-anchor','end')
            .text('winner Points by Player 2')


    });

}
