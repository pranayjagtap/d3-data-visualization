function barchart(d) {

    var d = d;
    console.log(d);
    d3                                                                    //To clear previous rendering added on 09-Sep-2018
        .select("#vis_canvas3")
        .selectAll("*")
        .remove();

    var margin = {top: 70, right: 50, bottom: 70, left: 50},
        width = 400,
        height = 400;


    var body = d3.select('#vis_canvas3')
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

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

        data.forEach(function (d) {
            d.year = +d.year;
            d.error1 = +d.error1;
        });

        x.domain(data.map(function (d) {
            return d.year;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.error1;
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
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .style("fill", "steelblue")
            .attr("x", function (d) {
                return x(d.year);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.error1);
            })
            .attr("height", function (d) {
                return height - y(d.error1);
            });

    });

}