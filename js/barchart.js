function barchart(d) {


    console.log(d);
    d3                                                                    //To clear previous rendering added on 09-Sep-2018
        .select("#vis_canvas3")
        .selectAll("*")
        .remove();


    //Variables
    var margin = {top: 70, right: 50, bottom: 70, left: 50},
        width = 400,
        height = 400;
    var mindate = new Date(2004),
        maxdate = new Date(2014);
    var d = d;
    var body = d3.select('#vis_canvas3')
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);
    var myData=200;
    var myName;
    var errorCount=0;
    var myName2;
    var errorCount2=0;
    var myName3;
    var errorCount3=0;
    var myName4;
    var errorCount4=0;

    //Axes orientations
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    //Main svg body
    var svg = body.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    //Mother for loop for fetching data
    d3.csv("./data/10yearAUSOpenMatches.csv", function (error, csv_data) {

        //Created nested data structure--> Key=Player->(Inner key->Year: Value->error points)
        var data2 = d3.nest(d)
            .key(function(d) { return d.player1;})
            .key(function(d){return d.year})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.error1; });  //Taking sum of all the points for a particular year(key)
            }).entries(csv_data);
        data2.forEach(function(data2) {
            data2.player1 = data2.key;
            data2.error1 = data2.values;
            data2.year=+data2.year;
        });

        //Repeated above for player 2
        var data3 = d3.nest(d)
            .key(function(d) { return d.player2;})
            .key(function(d){return d.year})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.error2; });
            }).entries(csv_data);
        data3.forEach(function(data3) {
            data3.player2 = data3.key;
            data3.error2 = data3.values;
            data3.year=+data3.year;
        });


        //First nested for loops fetch all the rows where player1 and player2 won ie were player1

        for(var i=0;i<data2.length;i++)                              //For loop added on 10-sep-2018 for nested retrieving data for player 1
            for(var j=0;j<data2[i].error1.length;j++) {

                if(data2[i].player1===d.player1){                    //If cond added on 11-Sep-2018 to Compare player name as key to aggregate that player's stats
                    myName=data2[i].player1;

                    errorCount=data2[i].error1;

                }else if(data2[i].player1===d.player2){             //to get player 2 data whenever he played as player1
                    myName2=data2[i].player1;

                    errorCount2=data2[i].error1;
                }
            }

        //Second nested for loops fetch all the rows where player1 and player2 lost ie were player2
        for(var i=0;i<data3.length;i++)                              //For loop  added on 10-sep-2018 for nested retrieving data for player2
            for(var j=0;j<data3[i].error2.length;j++) {

                if(data3[i].player2===d.player2){                    //If cond added on 11-Sep-2018 to Compare player name as key to aggregate that player's stats
                    myName3=data3[i].player2;

                    errorCount3=data3[i].error2;

                }else if(data3[i].player2===d.player1){
                    myName4=data3[i].player2;

                    errorCount4=data3[i].error2;
                }

            }


        //Set hardcoded minmax for domain
        x.domain([mindate,maxdate] );
        y.domain([0, 1000]);


        //Set x-y axes and append to svg
        svg.append('g')
            .attr('class','axis')
            .attr('transform', 'translate(0,' + height + ')')
            .style({ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px','font-size':'10px'})
            .call(xAxis)
            .append('text') // X-axis Label
            .attr('class','label')
            .attr('y',-10)
            .attr('x',width)
            .attr('dx','.50em')
            .style('text-anchor','end')
            .text('Years')

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("ERRORS");



        //Plot bars of bar chart
        svg.selectAll(".bar")
            .data(errorCount)
            .enter().append("rect")
            .attr("class", "bar")
            .style("fill", "steelblue")
            .attr("x", function (errorCount) {
                return x(errorCount[1].key);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (errorCount) {
                return y(errorCount.values);
            })
            .attr("height", function (errorCount) {
                return height - y(errorCount.values);
            });
        console.log(errorCount);

    });

}