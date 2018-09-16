function linegraph(d){


    //To clear previous rendering added on 09-Sep-2018
    d3
        .select("#vis_canvas2")
        .selectAll("*")
        .remove();


    //Variable declarations
    var body = d3.select('#vis_canvas2')
    var page=document.getElementById("vis_canvas2")
    var margin = {top: 70, right: 50, bottom: 70, left: 50}
    var h = 400; //page.clientWidth-600//500 - margin.top - margin.bottom
    var w = 400; //page.clientWidth-600//500 - margin.left - margin.right
    var d=d;
    var myData=200;
    var myName;
    var totalCount=0;
    var myName2;
    var totalCount2=0;
    var myName3;
    var totalCount3=0;
    var myName4;
    var totalCount4=0;
    var x = d3.scale.linear().range([0, w]);
    var y = d3.scale.linear().range([h, 0]);

    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom")
        .innerTickSize(-w)
        .outerTickSize(0)
        .tickPadding(10);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left")
        .innerTickSize(-h).outerTickSize(0)
        .tickPadding(10);

// Adds the svg canvas-->BASE STEP (08-Sept-2018)
    var svg = body.append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Fetching AUS Open data from CSV file
// Mother For loop begins
    d3.csv("./data/10yearAUSOpenMatches.csv", function(total, csv_data) {

        //Created nested data structure--> Key=Player->(Inner key->Year: Value->Total points)
        var data2 = d3.nest(d)
            .key(function(d) { return d.player1;})
            .key(function(d){return d.year})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.total1; });  //Taking sum of all the points for a particular year(key)
            }).entries(csv_data);
        data2.forEach(function(data2) {
            data2.player1 = data2.key;
            data2.total1 = data2.values;
            data2.year=+data2.year;
        });

        //Repeated above for player 2
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


       //First nested for loops fetch all the rows where player1 and player2 won ie were player1

        for(var i=0;i<data2.length;i++)                              //For loop added on 10-sep-2018 for nested retrieving data for player 1
            for(var j=0;j<data2[i].total1.length;j++) {

                if(data2[i].player1===d.player1){                    //If cond added on 11-Sep-2018 to Compare player name as key to aggregate that player's stats
                    myName=data2[i].player1;

                    totalCount=data2[i].total1;

                }else if(data2[i].player1===d.player2){             //to get player 2 data whenever he played as player1
                    myName2=data2[i].player1;

                    totalCount2=data2[i].total1;
                }
            }

        //Second nested for loops fetch all the rows where player1 and player2 lost ie were player2
        for(var i=0;i<data3.length;i++)                              //For loop  added on 10-sep-2018 for nested retrieving data for player2
            for(var j=0;j<data3[i].total2.length;j++) {

                if(data3[i].player2===d.player2){                    //If cond added on 11-Sep-2018 to Compare player name as key to aggregate that player's stats
                    myName3=data3[i].player2;

                    totalCount3=data3[i].total2;

                }else if(data3[i].player2===d.player1){
                    myName4=data3[i].player2;

                    totalCount4=data3[i].total2;
                }

            }

        //Plot of value lines for graph
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

        // Scale the range of the data-->hardcoded because selecting max from 4 separate objects added complexity to code
        var mindate = new Date(2004),
            maxdate = new Date(2014);
        var choose=[totalCount,totalCount2,totalCount3,totalCount4]

        x.domain([mindate,maxdate] );
        y.domain([0, 1000]);



        //Color grade 10 used because no need for shades
        var color = d3.scale.category10();


        //X-Axis
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom').tickFormat(d3.format("d")).ticks(10);

        // Y-axis
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')


        //data points--> Variavle assignment for data points on graph
        var selectCircle = svg.selectAll(".circle")
            .data(totalCount)
        var selectCircle2 = svg.selectAll(".circle")
            .data(totalCount2)
        var selectCircle3 = svg.selectAll(".circle")
            .data(totalCount3)
        var selectCircle4 = svg.selectAll(".circle")
            .data(totalCount4)
        console.log(myName)


    //Plot points on graph-->mouseover, mouseout events associated with this element to enable user to have interactive data vis
        selectCircle.enter().append("circle")
            .attr("class", "circle")
            .attr("r", 7)
            .style('opacity',0.4)
            .attr("cx", function(totalCount) {
                return x(totalCount.key)
            })
            .attr("cy", function(totalCount) {
                return y(totalCount.values)
            })
            .on('mouseover', function (totalCount) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',10)
                    .attr('stroke-width',3)
                    .enter()
                    .append('title')
                    .text(function (totalCount) { return 'Player Name :'+myName+'\nType:Games Won'+'\nTotal Points:'+totalCount.values+'\nYear:'+totalCount.key;})


            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',7)
                    .attr('stroke-width',1)
            })
            .append('title')
            .text(function (totalCount) { return 'Player Name :'+myName+'\nType:Games Won'+'\nTotal Points:'+totalCount.values+'\nYear:'+totalCount.key;})

        selectCircle2.enter().append("circle")
            .attr("class", "circle")
            .attr("r", 7)
            .style('opacity',0.4)
            .attr("cx", function(totalCount2) {
                return x(totalCount2.key)
            })
            .attr("cy", function(totalCount2) {
                return y(totalCount2.values)
            })
            .on('mouseover', function (totalCount2) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',10)
                    .attr('stroke-width',3)
                    .enter()
                    .append('title')
                    .text(function (totalCount2) { return 'Player Name :'+myName2+'\nType:Games Won'+'\nTotal Points:'+totalCount2.values+'\nYear:'+totalCount2.key;})


            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',7)
                    .attr('stroke-width',1)
            })
            .append('title')
            .text(function (totalCount2) { return 'Player Name :'+myName2+'\nType:Games Won'+'\nTotal Points:'+totalCount2.values+'\nYear:'+totalCount2.key;})



        selectCircle3.enter().append("circle")
            .attr("class", "circle")
            .attr("r", 7)
            .style('opacity',0.4)
            .attr("cx", function(totalCount3) {
                return x(totalCount3.key)
            })
            .attr("cy", function(totalCount3) {
                return y(totalCount3.values)
            })
            .on('mouseover', function (totalCount3) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',10)
                    .attr('stroke-width',3)
                    .enter()
                    .append('title')
                    .text(function (totalCount3) { return 'Player Name :'+myName2+'\nType:Games Lost'+'\nTotal Points:'+totalCount3.values+'\nYear:'+totalCount3.key;})


            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',7)
                    .attr('stroke-width',1)
            })
            .append('title')
            .text(function (totalCount3) { return 'Player Name :'+myName2+'\nType:Games Lost'+'\nTotal Points:'+totalCount3.values+'\nYear:'+totalCount3.key;})


        selectCircle4.enter().append("circle")
            .attr("class", "circle")
            .attr("r", 7)
            .style('opacity',0.4)
            .attr("cx", function(totalCount4) {
                return x(totalCount4.key)
            })
            .attr("cy", function(totalCount4) {
                return y(totalCount4.values)
            })
            .on('mouseover', function (totalCount4) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',10)
                    .attr('stroke-width',3)
                    .enter()
                    .append('title')
                    .text(function (totalCount4) { return 'Player Name :'+myName+'\nType:Games Lost'+'\nTotal Points:'+totalCount4.values+'\nYear:'+totalCount4.key;})
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',7)
                    .attr('stroke-width',1)
            })
            .append('title')
            .text(function (totalCount4) { return 'Player Name :'+myName+'\nType:Games Lost'+'\nTotal Points:'+totalCount4.values+'\nYear:'+totalCount4.key;})

        //Stats of Player 1(winner) when he won
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

            });

        //Stats of Player 2(loser) when he won
        svg.append("path")             //
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


        //Stats of Player 2(loser) when he lost
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


        //Stats of Player 1(winner) when he lost
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




        // Plot X-axis--> Added x axis to main svg
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
        // Plot Y-axis--> Added y axis to main svg
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


    /*  Added background grids to the Line graph.
     * variables passed:w,h to tickSize;x,y to scale */

        var yAxisGrid = d3.svg.axis().scale(y)
            .ticks(21)
            .tickSize(w, 0)
            .tickFormat("")   //Setting text on axis to null
            .orient("right");

        var xAxisGrid = d3.svg.axis().scale(x)
            .ticks(11)
            .tickSize(-h, 0)
            .tickFormat("")
            .orient("top");

    // Linked grids to the main svg

        svg.append("g")
            .classed('y', true)
            .classed('axis', true)
            .call(yAxisGrid);

        svg.append("g")
            .classed('x', true)
            .classed('axis', true)
            .call(xAxisGrid);



                // Linked grids to the main svg

                svg.append("g")
                    .classed('y', true)
                    .classed('axis', true)
                    .call(yAxisGrid);

                svg.append("g")
                    .classed('x', true)
                    .classed('axis', true)
                    .call(xAxisGrid);

 /*               //Lasso Module begins

                var lasso_start = function() {
                    lasso.items()
                        .attr("r",10) // reset size
                        .style("fill",null) // clear all of the fills
                        .classed({"not_possible":true,"selected":false}); // style as not possible
                };

                var lasso_draw = function() {
                    // Style the possible dots
                    lasso.items().filter(function(d) {return d.possible===true})
                        .classed({"not_possible":false,"possible":true});

                    // Style the not possible dot
                    lasso.items().filter(function(d) {return d.possible===false})
                        .classed({"not_possible":true,"possible":false});
                };

                var lasso_end = function() {
                    // Reset the color of all dots
                    lasso.items()
                        .style("fill", function(d) { return color(0); })
                        .append('title')
                        .text("selected")
                    ;

                    // Style the selected dots
                    lasso.items().filter(function(d) {return d.selected===true})
                        .classed({"not_possible":false,"possible":false})
                        .attr("r",10)
                    ;

                    // Reset the style of the not selected dots
                    lasso.items().filter(function(d) {return d.selected===false})
                        .classed({"not_possible":true,"possible":false})


                        .attr("r",5)
                        .style("fill", function(d) { return d3.color('#000000') })
                        .style('opacity',0.4);

                };


        // Create the area where the lasso event can be triggered
                var lasso_area = svg.append("rect")
                    .attr("width",w)
                    .attr("height",h)
                    .style("opacity",0);

        // Define the lasso
                var lasso = d3.lasso()
                    .closePathDistance(75) // max distance for the lasso loop to be closed
                    .closePathSelect(true) // can items be selected by closing the path?
                    .hoverSelect(true) // can items by selected by hovering over them?
                    .area(lasso_area) // area where the lasso can be started
                    .on("start",lasso_start) // lasso start function
                    .on("draw",lasso_draw) // lasso draw function
                    .on("end",lasso_end); // lasso end function

        // Init the lasso on the svg:g that contains the dots
                svg.call(lasso);
                lasso.items(d3.selectAll("circle"))        ;




*/

    });
    // Mother Data Loop ends --> For loop for data fetch





}