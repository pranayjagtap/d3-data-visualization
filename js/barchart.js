function barchart() {



    d3                                                                    //To clear previous rendering added on 09-Sep-2018
        .select("#vis_canvas3")
        .selectAll("*")
        .remove();

    var margin = {top: 70, right: 50, bottom: 70, left: 50},
        width = 400,
        height = 400;


    var body = d3.select('#vis_canvas3')
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    var color = d3.scale.category10();
    var y = d3.scale.linear().range([height, 0]);
var data3=0;
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = body.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("./data/10yearAUSOpenMatches.csv", function (error, data) {
        var d=data;
        data.forEach(function (data) {
            data.year = +data.year;
            data.error2 = +data.error2;
        });
        //Repeated above for player 2
        var data3 = d3.nest(d)
            .key(function(d) { return d.year;})

            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.error2; });
            }).entries(data);
        data3.forEach(function(data3) {
            data3.year = +data3.key;
            data3.error2 = data3.values;

        });
console.log(data3[1].values)
            console.log(data3)

        x.domain(data3.map(function (data3) {
            return data3.key;
        }));
        y.domain([0, d3.max(data3, function (data3) {
            return data3.values;
        })]);
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

        svg.selectAll(".bar")
            .data(data3)
            .enter().append("rect")
            .on("mouseover", function(data3) {
                d3.select(this).attr("opacity", 0.5)
                d3.select(this)
                    .attr('stroke-width',5)
                    .enter()
                    .append('title')
                    .text(function (data3) { return 'Player Name :'+data3.key+'\nerror Errors:'+data3.values;})
            })
            .on("mouseout", function(d) {
                d3.select(this).attr("opacity", 1)
            })
            .on("click",function(d){
                second_scatterplot(d);

            })
            .attr("class", "bar")
            .style("fill", "steelblue")
            .attr("x", function (data3) {
                return x(data3.key);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (data3) {
                return y(data3.values);
            })
            .attr("height", function (data3) {
                return height - y(data3.values);
            })
            .append('title')
            .text(function (data3) { return 'Year'+data3.key+'\nGrand total error Points:'+data3.values;})

        ;
        console.log(data3)
    });

}