
function second_scatterplot(d) {
    var da=d;


    //Added this on 10-Sep-2018 to clear screen as new points after adding filter would just plot on top of old one. Fix to clear old graph
    d3
        .select("#vis_canvas4")
        .selectAll("*")
        .remove();





// set the dimensions and margins of the graph
    d3.csv('./data/10yearAUSOpenMatches.csv', function (data) {
        data.forEach(function(d) {

            d.error1 = +d.error1;
            d.error2 = +d.error2;

        });

        // Variables
        var mycanvas = d3.select('#vis_canvas4')
        var margin = { top: 70, right: 50, bottom: 70, left: 50 }
        var page=document.getElementById("vis_canvas")
        var h = 400;//page.clientWidth-600//500 - margin.top - margin.bottom
        var w = 400;//page.clientWidth-600//500 - margin.left - margin.right
        console.log(h+'X'+w)




        // Standard Scale to define ddomain and range
        var backcolor = d3.scale.category20()
        var xScale = d3.scale.linear()
            .domain([
                d3.min([d3.min(data,function (d) {
                    return d.error1
                })])/ 1.05,
                d3.max([0,d3.max(data,function (d) {
                    return d.error1
                })*1.05])

            ])
            .range([d3.min(data,function (d) {
                return d.error1
            }),w])
        var yScale = d3.scale.linear()
            .domain([
                d3.min([d3.min(data,function (d) {
                    return d.error2
                })]),
                d3.max([d3.max(data,function (d) {
                    return d.error2
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

        console.log(da.year);
        // points that represent data points of each match
        var point1 = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .filter(function(d) {                                   //Part2: Added filtering condition on 09-Sep-2018 to provide yearly view of data
                return d.year === da.key ? this : null;
            })
            .attr('cx',function (d) { return xScale(d.error1) })
            .attr('cy',function (d) { return yScale(d.error2) })
            .attr('r','5')
            .attr('stroke','black')
            .attr('stroke-width',1)
            .attr('fill',function (d,i) { return backcolor(0) })

            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',10)
                    .attr('stroke-width',3)
                    .enter()
                    .append("text")
                    .text(function(d) {return 'Player 1:'+d.player1+'\nPlayer 2:'+d.player2+'\nerror1:'+d.error1+'\nerror2:'+d.error2;});


            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',5)
                    .attr('stroke-width',1)
            })
            .append('title')
            .text(function (d) { return 'Player 1:'+d.player1+'\nPlayer 2:'+d.player2+'\nerror 1: '+ d.error1 +
                '\nerror 2: ' + d.error2 })



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
            .text('error Points by Player 1')
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
            .text('error Points by Player 2')


        /*  Added background grids to the Line graph.
  * variables passed:w,h to tickSize;x,y to scale */
        var yAxisGrid = d3.svg.axis().scale(yScale)
            .ticks(20)
            .tickSize(w, 0)
            .tickFormat("")   //Setting text on axis to null
            .orient("right");

        var xAxisGrid = d3.svg.axis().scale(xScale)
            .ticks(11)
            .tickSize(-h, 0)
            .tickFormat("")
            .orient("top");


        //Lasso Module begins

        var lasso_start = function() {
            lasso.items()
                .attr("r",5)
                .style("fill",null)
                .classed({"not_possible":true,"selected":false});
        };

        var lasso_draw = function() {

            lasso.items().filter(function(d) {return d.possible===true})
                .classed({"not_possible":false,"possible":true});


            lasso.items().filter(function(d) {return d.possible===false})
                .classed({"not_possible":true,"possible":false});
        };

        var lasso_end = function() {

            lasso.items()
                .style("fill", function(d) { return backcolor(4); });

            lasso.items().filter(function(d) {return d.selected===true})
                .classed({"not_possible":false,"possible":false})
                .attr("r",10);


            lasso.items().filter(function(d) {return d.selected===false})
                .classed({"not_possible":true,"possible":false})
                .attr("r",5)
                .style("fill",backcolor(0))

        };


        var lasso_area = svg.append("rect")
            .attr("width",w)
            .attr("height",h)
            .style("opacity",0);


        var lasso = d3.lasso()
            .closePathDistance(75)
            .closePathSelect(true)
            .hoverSelect(true)
            .area(lasso_area)
            .on("start",lasso_start)
            .on("draw",lasso_draw)
            .on("end",lasso_end);


        svg.call(lasso);
        lasso.items(d3.selectAll("#vis_canvas4 circle"));




    });




}
