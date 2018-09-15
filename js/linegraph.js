function linegraph(d){

    var d=d;
    console.log(d);
    d3                                                                    //To clear previous rendering added on 09-Sep-2018
        .select("#vis_canvas2")
        .selectAll("*")
        .remove();

    var body = d3.select('#vis_canvas2')
    var page=document.getElementById("vis_canvas2")
    var margin = {top: 70, right: 50, bottom: 70, left: 50}
    var h = 400; //page.clientWidth-600//500 - margin.top - margin.bottom
    var w = 400; //page.clientWidth-600//500 - margin.left - margin.right




    var x = d3.scale.linear().range([0, w]);
    var y = d3.scale.linear().range([h, 0]);




    console.log(h);
    console.log(x);
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom")
        .innerTickSize(-w)
        .outerTickSize(0)
        .tickPadding(10);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left")
        .innerTickSize(-h).outerTickSize(0)
        .tickPadding(10);




// Adds the svg canvas
    var svg = body.append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Get the data
    d3.csv("./data/10yearAUSOpenMatches.csv", function(total, csv_data) {

        var data2 = d3.nest(d)
            .key(function(d) { return d.player1;})
            .key(function(d){return d.year})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.total1; });
            }).entries(csv_data);
        data2.forEach(function(data2) {
            data2.player1 = data2.key;
            data2.total1 = data2.values;


            data2.year=+data2.year;
        });
        var data3 = d3.nest(d)
            .key(function(d) { return d.player2;})
            .key(function(d){return d.year})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.total2; });
            }).entries(csv_data);
        data3.forEach(function(data3) {
            data3.player2 = data3.key;
            data3.total2 = data3.values;


            data3.year=+data3.year;
        });



        var myData=200;
        var myName;
        var totalCount=0;
        var myName2;
        var totalCount2=0;
        var myName3;
        var totalCount3=0;
        var myName4;
        var totalCount4=0;
        for(var i=0;i<data2.length;i++)                              //Mother for loop added on 10-sep-2018 for nested retrieving data
            for(var j=0;j<data2[i].total1.length;j++) {

                if(data2[i].player1===d.player1){                    //If cond added on 11-Sep-2018 to Compare player name as key to aggregate that player's stats
                    myName=data2[i].player1;

                    totalCount=data2[i].total1;

                }else if(data2[i].player1===d.player2){             //to get player 2 data whenever he played as player1
                    myName2=data2[i].player1;

                    totalCount2=data2[i].total1;
                }
            }
        for(var i=0;i<data3.length;i++)                              //Mother for loop added on 10-sep-2018 for nested retrieving data
            for(var j=0;j<data3[i].total2.length;j++) {

                if(data3[i].player2===d.player2){                    //If cond added on 11-Sep-2018 to Compare player name as key to aggregate that player's stats
                    myName3=data3[i].player2;

                    totalCount3=data3[i].total2;

                }else if(data3[i].player2===d.player1){
                    myName4=data3[i].player2;

                    totalCount4=data3[i].total2;
                }

            }

        console.log(data2);
        console.log(data3);
        console.log(myName2);
        console.log(totalCount);
        console.log(totalCount2);


        var valueline = d3.svg.line()
            .x(function(totalCount) { return x(totalCount.key); })
            .y(function(totalCount) { return y(totalCount.values); });
        var valueline2 = d3.svg.line()
            .x(function(totalCount2) { return x(totalCount2.key); })
            .y(function(totalCount2) { return y(totalCount2.values); });
        var valueline3 = d3.svg.line()
            .x(function(totalCount3) { return x(totalCount3.key); })
            .y(function(totalCount3) { return y(totalCount3.values); });
        var valueline4 = d3.svg.line()
            .x(function(totalCount4) { return x(totalCount4.key); })
            .y(function(totalCount4) { return y(totalCount4.values); });

        // Scale the range of the data
        var mindate = new Date(2004),
            maxdate = new Date(2014);
        var choose=[totalCount,totalCount2,totalCount3,totalCount4]
        x.domain([mindate,maxdate] );
        y.domain([0, d3.max(totalCount, function(totalCount) { return totalCount.values; })]);


        legendSpace = w/data2.length;
        var color = d3.scale.category10();
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom').tickFormat(d3.format("d")).ticks(10);

        console.log(xAxis);
        // Y-axis
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')


        // Add the valueline path.
        svg.append("path")

            .attr("class", "line")
            .attr("d", valueline(totalCount))
            .attr('stroke',function(d){return d3.rgb("#4682b4")}) //#9abad6 Color Hex Steel Blue #ff0000
            .attr('stroke-width',1)
            .on('mouseover', function () {
                div.transition()
                    .transition()
                    .duration(500)
                    .style("opacity", 1)

                    .text(function(d) {return myName+'(W)'})

            })


        ;
        svg.append("path")

            .attr("class", "line")
            .attr("d", valueline2(totalCount2))
            .attr('stroke',function(d){return d3.rgb("#7f0000")})
            .attr('stroke-width',1)
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(500)

                    .attr('stroke-width',3)
                    .enter()
                    .append("text")
                    .text(function(d) {return myName2+"(L)"})

            });

        svg.append("path")

            .attr("class", "line")
            .attr("d", valueline3(totalCount3))
            .attr('stroke',function(d){return d3.rgb("#ff7f7f")})
            .attr('stroke-width',1)
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(500)

                    .attr('stroke-width',3)
                    .enter()
                    .append("text")
                    .text(function(d) {return myName2+"(W)"}) });

        svg.append("path")

            .attr("class", "line")
            .attr("d", valueline4(totalCount4))
            .attr('stroke',function(d){return d3.rgb("#9abad6")})
            .attr('stroke-width',1)
            .on('mouseover', function () {
                d3.select(this)
                    .transition()
                    .duration(500)

                    .attr('stroke-width',3)
                    .enter()
                    .append("text")
                    .text(function(d) {return myName+"(L)"})
            })




        // X-axis
        svg.append('g')
            .attr('class','axis')
            .attr('transform', 'translate(0,' + h + ')')
            .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px','font-size':'10px'})
            .call(xAxis)
            .append('text') // X-axis Label
            .attr('class','label')
            .attr('y',-10)
            .attr('x',w)
            .attr('dx','.50em')
            .style('text-anchor','end')
            .text('Years')
        // Y-axis
        svg.append('g')
            .attr('class', 'axis')
            .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px','font-size':'10px'})
            .call(yAxis)
            .append('text') // y-axis Label
            .attr('class','label')
            .attr('transform','rotate(-90)')
            .attr('x',0)
            .attr('y',1)
            .attr('dy','.71em')
            .style('text-anchor','end')
            .text('total points')

        /*   svg.selectAll(".vline").data(d3.range(20)).enter()
               .append("line")
               .attr("x1", function (d) {
                   return d * 40;
               })
               .attr("x2", function (d) {
                   return d * 40;
               })
               .attr("y1", function (d) {
                   return 0;
               })
               .attr("y2", function (d) {
                   return 400;
               })
               .style("stroke", "black");

   // horizontal lines
           svg.selectAll(".vline").data(d3.range(20)).enter()
               .append("line")
               .attr("y1", function (d) {
                   return d * 40;
               })
               .attr("y2", function (d) {
                   return d * 40;
               })
               .attr("x1", function (d) {
                   return 0;
               })
               .attr("x2", function (d) {
                   return 400;
               })
               .style("stroke", "black");*/



        var yAxisGrid = d3.svg.axis().scale(y)
            .ticks(21)
            .tickSize(w, 0)

            .orient("right");

        var xAxisGrid = d3.svg.axis().scale(x)
            .ticks(11)
            .tickSize(-h, 0)
            .tickFormat("")
            .orient("top");

        svg.append("g")
            .classed('y', true)
            .classed('axis', true)
            .call(yAxisGrid);

        svg.append("g")
            .classed('x', true)
            .classed('axis', true)
            .call(xAxisGrid);
    });

}