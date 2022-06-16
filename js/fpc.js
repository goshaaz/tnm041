
function focusPlusContext(data)
{

    // Creating margins and figure sizes
    var margin = { top: 20, right: 20, bottom: 150, left: 40 },
        margin2 = { top: 110, right: 20, bottom: 50, left: 40 },
        width = $("#scatterplot").parent().width() - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        height2 = 200 - margin2.top - margin2.bottom;


    var svg = d3.select("#scatterplot").append("svg")
        .attr("postion", "relative")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom);


    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);


    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var selector = document.getElementById("position_selector");
    var Pos = selector.value;
	 
    var selected_team = ($('input[name=radioName]:checked', '#myForm').val());

    //<---------------------------------------------------------------------------------------------------->

    //                  ********** PARAMETERS OF THE FOCUS AREA ****************

    // Scales and axis
    var xScale = d3.scaleLinear()
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .range([height, 0]);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);


    //<---------------------------------------------------------------------------------------------------->

    //                  ********** PARAMATERS OF THE CONTEXT GRAPH ****************

    // Scales and axis
    var navXScale = d3.scaleLinear()
        .range([0, width]);
    var navYScale = d3.scaleLinear()
        .range([height2, 0]);
    var navXAxis = d3.axisBottom(navXScale);

    
    // Brush function
    var brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush", brushed);


    //<---------------------------------------------------------------------------------------------------->

    //Setting scale parameters
    var minAge = d3.min(data, function (d) { return d.age - 1 });
    var maxAge = d3.max(data, function (d) { return d.age});
    var minPace = d3.min(data, function (d) { return d.pace - 1});
    var maxPace = d3.max(data, function (d) { return d.pace});


    // Set the axes scales, both for focus and context
    xScale.domain([16, 37]);                     // X axis : age of the players
    yScale.domain([40, 100]);                   // Y axis : pace of the players
    navXScale.domain(xScale.domain());
    navYScale.domain(yScale.domain());



    //<---------------------------------------------------------------------------------------------------->

    //                  ********** RENDERING THE CONTEXT CHART ****************


    // Append g tag for plotting the dots and axes
    var dots = context.append("g");
    dots.attr("clip-path", "url(#clip)");


    // Call the navigation axis on context
    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(navXAxis);


    // Plot the small dots on the context graph.
    small_points = dots.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dotContext")
        .filter(function (d)
        {

            if (Pos === "Defenders")
            {
                return (d.player_positions.startsWith("RB")) || (d.player_positions.startsWith("LWB")) || (d.player_positions.startsWith("RWB")) || (d.player_positions.startsWith("LB")) || (d.player_positions.startsWith("CB"))
            }

            if (Pos === "Midfielders")
            {
                return (d.player_positions.startsWith("CDM")) || (d.player_positions.startsWith("CM")) || (d.player_positions.startsWith("CAM")) || (d.player_positions.startsWith("RM")) || (d.player_positions.startsWith("LM"))
            }

            if (Pos === "Attackers")
            {
                return (d.player_positions === ("RW")) || (d.player_positions.startsWith("RW,")) || (d.player_positions === ("LW")) || (d.player_positions.startsWith("LW,")) || (d.player_positions.startsWith("RF")) || (d.player_positions.startsWith("LF")) || (d.player_positions.startsWith("CF")) || (d.player_positions.startsWith("ST"))
            }
            else {
                return d.player_positions != ("GK")
            }
        })
        .filter(function (d)
        {
            if (selected_team === "All teams") {
                return (d.club == "Real Madrid" || d.club == "FC Barcelona" || d.club == "Paris-Saint Germain" || d.club == "FC Bayern M�nchen" || d.club == "Liverpool" || d.club == "Manchester United" || d.club == "Manchester City" || d.club == "Juventus" || d.club == "Atl�tico Madrid")
            }
            else {
                return d.club == selected_team
            }
        })
        .attr("cx", function (d)
        {
            return navXScale(d.age);
        })
        .attr("cy", function (d)
        {
            return navYScale(d.pace);
        });


    // Call plot function
    var points_func = new Points();
    points_func.plot(small_points, 4);


    //<---------------------------------------------------------------------------------------------------->

    //                  ********** RENDERING THE FOCUS CHART ****************


    // Append g tag for plotting the dots and axes
    var dots = focus.append("g");
    dots.attr("clip-path", "url(#clip)");


    // Call x axis
    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


    // Call y axis
    focus.append("g")
        .attr("class", "axis axis-y")
        .call(yAxis);


    //Add y axis label to the scatter plot
    d3.select(".legend")
        .style('left', "170px")
        .style('top', '300px');
    svg.append("text")
        .attr('class', "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr('x', -300)
        .attr('text-anchor', "end")
        .attr('dy', ".75em")
        .style("font-size", "15px")
        .text("Pace");


    //Add x axis label to the scatter plot
    d3.select(".legend")
        .style('left', "170px")
        .style('top', '300px');
    svg.append("text")
        .attr('class', "axis-label")
        .attr("transform", "rotate(0)")
        .attr("y", 570)
        .attr('x', 520)
        .attr('text-anchor', "end")
        .attr('dy', ".75em")
        .style("font-size", "15px")
        .text("Age");

    
    // Plot the dots on the focus graph
    selected_dots = dots.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("style", "opacity: 0.6")
        .filter(function (d)
        {
            if (Pos === "Defenders")
            {
                return (d.player_positions.startsWith("RB")) || (d.player_positions.startsWith("LWB")) || (d.player_positions.startsWith("RWB")) || (d.player_positions.startsWith("LB")) || (d.player_positions.startsWith("CB"))
            }

            if (Pos === "Midfielders")
            {
                return (d.player_positions.startsWith("CDM")) || (d.player_positions.startsWith("CM")) || (d.player_positions.startsWith("CAM")) || (d.player_positions.startsWith("RM")) || (d.player_positions.startsWith("LM"))
            }

            if (Pos === "Attackers")
            {
                return (d.player_positions === ("RW")) || (d.player_positions.startsWith("RW,")) || (d.player_positions === ("LW")) || (d.player_positions.startsWith("LW,")) || (d.player_positions.startsWith("RF")) || (d.player_positions.startsWith("LF")) || (d.player_positions.startsWith("CF")) || (d.player_positions.startsWith("ST"))
            }
            else
            {
                return d.player_positions != ("GK")
            }

        })
        .filter(function (d)
        {
            if (selected_team === "All teams") {
                return (d.club == "Real Madrid" || d.club == "FC Barcelona" || d.club == "Paris-Saint Germain" || d.club == "FC Bayern M�nchen" || d.club == "Liverpool" || d.club == "Manchester United" || d.club == "Manchester City" || d.club == "Juventus" || d.club == "Atl�tico Madrid")
            }
            else {
                return d.club == selected_team
            }
        })
        .attr("cx", function (d)
        {
            return xScale(d.age);
        })
        .attr("cy", function (d)
        {
            return yScale(d.pace);
        });


    // Call plot function
    points_func.plot(selected_dots, 1);


   
    //<---------------------------------------------------------------------------------------------------->


    // ******************************** IMPLEMENTING MOUSE FUNCTIONS ************************************

    //Mouseover function
    mouseOver(selected_dots);

    //Mouseout function
    mouseOut(selected_dots);


    //                  ********** MOUSE OVER FUNCTION ****************

    // This function is called when the mouse is over a point on the focus chart
    function mouseOver(selected_dots)
    {
        selected_dots
            .on("mouseover", function (d)
            {
                // Get player information by calling the tooltip function
                points_func.tooltip(d);

                //Increase the size on the point to focus on it
                d3.select(this).attr('r', 30)
            });
    }


    //                  ********** MOUSE OUT FUNCTION ****************

    // This function is called after the mouseOver function, when the mouse leaves the point
    function mouseOut(selected_dots)
    {
        selected_dots
            .on("mouseout", function ()
            {
                // Returning to original characteristics
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", function (d)
                    {
                        return 18;
                    })
            });
    }


    //<---------------------------------------------------------------------------------------------------->

    //                  ********** IMPLEMENTATION OF BRUSH FUNCTION ****************

    
    // Append the brush
    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, xScale.range());


    //Brush function for filtering through the data
    //Function that updates scatter plot and map each time brush is used
    function brushed()
    {
        var s = d3.event.selection || navXScale.range();
        xScale.domain(s.map(navXScale.invert, navXScale));
        focus.selectAll(".dot")
            .filter(function (d)
            {
                if (Pos === "Defenders")
                {
                    return (d.player_positions.startsWith("RB")) || (d.player_positions.startsWith("LWB")) || (d.player_positions.startsWith("RWB")) || (d.player_positions.startsWith("LB")) || (d.player_positions.startsWith("CB"))
                }

                if (Pos === "Midfielders")
                {
                    return (d.player_positions.startsWith("CDM")) || (d.player_positions.startsWith("CM")) || (d.player_positions.startsWith("CAM")) || (d.player_positions.startsWith("RM")) || (d.player_positions.startsWith("LM"))
                }

                if (Pos === "Attackers")
                {
                    return (d.player_positions === ("RW")) || (d.player_positions.startsWith("RW,")) || (d.player_positions === ("LW")) || (d.player_positions.startsWith("LW,")) || (d.player_positions.startsWith("RF")) || (d.player_positions.startsWith("LF")) || (d.player_positions.startsWith("CF")) || (d.player_positions.startsWith("ST"))
                }

                else
                {
                    return d.player_positions != ("GK")
                }
            })
            .filter(function (d)
            {
                if (selected_team === "All teams") {
                    return (d.club == "Real Madrid" || d.club == "FC Barcelona" || d.club == "Paris-Saint Germain" || d.club == "FC Bayern M�nchen" || d.club == "Liverpool" || d.club == "Manchester United" || d.club == "Manchester City" || d.club == "Juventus" || d.club == "Atl�tico Madrid")
                }
                else {
                    return d.club == selected_team
                }
            })
            .attr("cx", function (d)
            {
                return xScale(d.age);
            })
            .attr("cy", function (d)
            {
                return yScale(d.pace);
            })

        focus.select(".axis--x").call(xAxis);
        
        if (d3.event.type == "end")
        {
            var curr_view_erth = []
            d3.selectAll(".dot").each(
                function (d, i)
                {
                    if (d.age >= xScale.domain()[0] &&
                        d.age <= xScale.domain()[1])
                    {
                        curr_view_erth.push(d.id.toString());
                    }
                });
        }
    }
		
	const selectElement = document.querySelector('.position_selector');
    selectElement.addEventListener('change', (event) =>
    {
        selected_dots.remove();
        small_points.remove();

        var Pos = selector.value;
        var selected_team = ($('input[name=radioName]:checked', '#myForm').val());

        // Append g tag for plotting the dots and axes
        var dots = context.append("g");
        dots.attr("clip-path", "url(#clip)");

        // Plot the small dots on the context graph.
        small_points = dots.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dotContext")
            .filter(function (d) {

                if (Pos === "Defenders") {
                    return (d.player_positions.startsWith("RB")) || (d.player_positions.startsWith("LWB")) || (d.player_positions.startsWith("RWB")) || (d.player_positions.startsWith("LB")) || (d.player_positions.startsWith("CB"))
                }

                if (Pos === "Midfielders") {
                    return (d.player_positions.startsWith("CDM")) || (d.player_positions.startsWith("CM")) || (d.player_positions.startsWith("CAM")) || (d.player_positions.startsWith("RM")) || (d.player_positions.startsWith("LM"))
                }

                if (Pos === "Attackers") {
                    return (d.player_positions === ("RW")) || (d.player_positions.startsWith("RW,")) || (d.player_positions === ("LW")) || (d.player_positions.startsWith("LW,")) || (d.player_positions.startsWith("RF")) || (d.player_positions.startsWith("LF")) || (d.player_positions.startsWith("CF")) || (d.player_positions.startsWith("ST"))
                }
                else {
                    return d.player_positions != ("GK")
                }
            })
            .filter(function (d)
            {
                if (selected_team === "All teams") {
                    return (d.club == "Real Madrid" || d.club == "FC Barcelona" || d.club == "Paris-Saint Germain" || d.club == "FC Bayern M�nchen" || d.club == "Liverpool" || d.club == "Manchester United" || d.club == "Manchester City" || d.club == "Juventus" || d.club == "Atl�tico Madrid")
                }
                else {
                    return d.club == selected_team
                }
            })
            .attr("cx", function (d) {
                return navXScale(d.age);
            })
            .attr("cy", function (d) {
                return navYScale(d.pace);
            });


        // Call plot function
        var points_func = new Points();
        points_func.plot(small_points, 4);

        // Append g tag for plotting the dots and axes
        var dots = focus.append("g");
        dots.attr("clip-path", "url(#clip)");

        // Plot the dots on the focus graph
        selected_dots = dots.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("style", "opacity: 0.6")
            .filter(function (d) {

                if (Pos === "Defenders") {
                    return (d.player_positions.startsWith("RB")) || (d.player_positions.startsWith("LWB")) || (d.player_positions.startsWith("RWB")) || (d.player_positions.startsWith("LB")) || (d.player_positions.startsWith("CB"))
                }

                if (Pos === "Midfielders") {
                    return (d.player_positions.startsWith("CDM")) || (d.player_positions.startsWith("CM")) || (d.player_positions.startsWith("CAM")) || (d.player_positions.startsWith("RM")) || (d.player_positions.startsWith("LM"))
                }

                if (Pos === "Attackers") {
                    return (d.player_positions === ("RW")) || (d.player_positions.startsWith("RW,")) || (d.player_positions === ("LW")) || (d.player_positions.startsWith("LW,")) || (d.player_positions.startsWith("RF")) || (d.player_positions.startsWith("LF")) || (d.player_positions.startsWith("CF")) || (d.player_positions.startsWith("ST"))
                }
                else {
                    return d.player_positions != ("GK")
                }
            })
            .filter(function (d) {
                if (selected_team === "All teams") {
                    return (d.club == "Real Madrid" || d.club == "FC Barcelona" || d.club == "Paris-Saint Germain" || d.club == "FC Bayern M�nchen" || d.club == "Liverpool" || d.club == "Manchester United" || d.club == "Manchester City" || d.club == "Juventus" || d.club == "Atl�tico Madrid")
                }
                else {
                    return d.club == selected_team
                }
            })
            .attr("cx", function (d) {
                return xScale(d.age);
            })
            .attr("cy", function (d) {
                return yScale(d.pace);
            });

        // Call plot function
        points_func.plot(selected_dots, 1);
		
		//Mouseover function
        mouseOver(selected_dots);

        //Mouseout function
        mouseOut(selected_dots);
		
    });

    $('#myForm input').on('change', function ()
    {
        selected_dots.remove();
        small_points.remove();

        var Pos = selector.value;
        var selected_team = ($('input[name=radioName]:checked', '#myForm').val());

        // Append g tag for plotting the dots and axes
        var dots = context.append("g");
        dots.attr("clip-path", "url(#clip)");

        // Plot the small dots on the context graph.
        small_points = dots.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dotContext")
            .filter(function (d) {

                if (Pos === "Defenders") {
                    return (d.player_positions.startsWith("RB")) || (d.player_positions.startsWith("LWB")) || (d.player_positions.startsWith("RWB")) || (d.player_positions.startsWith("LB")) || (d.player_positions.startsWith("CB"))
                }

                if (Pos === "Midfielders") {
                    return (d.player_positions.startsWith("CDM")) || (d.player_positions.startsWith("CM")) || (d.player_positions.startsWith("CAM")) || (d.player_positions.startsWith("RM")) || (d.player_positions.startsWith("LM"))
                }

                if (Pos === "Attackers") {
                    return (d.player_positions === ("RW")) || (d.player_positions.startsWith("RW,")) || (d.player_positions === ("LW")) || (d.player_positions.startsWith("LW,")) || (d.player_positions.startsWith("RF")) || (d.player_positions.startsWith("LF")) || (d.player_positions.startsWith("CF")) || (d.player_positions.startsWith("ST"))
                }
                else {
                    return d.player_positions != ("GK")
                }
            })
            .filter(function (d) {
                if (selected_team === "All teams") {
                    return (d.club == "Real Madrid" || d.club == "FC Barcelona" || d.club == "Paris-Saint Germain" || d.club == "FC Bayern M�nchen" || d.club == "Liverpool" || d.club == "Manchester United" || d.club == "Manchester City" || d.club == "Juventus" || d.club == "Atl�tico Madrid")
                }
                else {
                    return d.club == selected_team
                }
            })
            .attr("cx", function (d) {
                return navXScale(d.age);
            })
            .attr("cy", function (d) {
                return navYScale(d.pace);
            });


        // Call plot function
        var points_func = new Points();
        points_func.plot(small_points, 4);

        // Append g tag for plotting the dots and axes
        var dots = focus.append("g");
        dots.attr("clip-path", "url(#clip)");

        // Plot the dots on the focus graph
        selected_dots = dots.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("style", "opacity: 0.6")
            .filter(function (d) {

                if (Pos === "Defenders") {
                    return (d.player_positions.startsWith("RB")) || (d.player_positions.startsWith("LWB")) || (d.player_positions.startsWith("RWB")) || (d.player_positions.startsWith("LB")) || (d.player_positions.startsWith("CB"))
                }

                if (Pos === "Midfielders") {
                    return (d.player_positions.startsWith("CDM")) || (d.player_positions.startsWith("CM")) || (d.player_positions.startsWith("CAM")) || (d.player_positions.startsWith("RM")) || (d.player_positions.startsWith("LM"))
                }

                if (Pos === "Attackers") {
                    return (d.player_positions === ("RW")) || (d.player_positions.startsWith("RW,")) || (d.player_positions === ("LW")) || (d.player_positions.startsWith("LW,")) || (d.player_positions.startsWith("RF")) || (d.player_positions.startsWith("LF")) || (d.player_positions.startsWith("CF")) || (d.player_positions.startsWith("ST"))
                }
                else {
                    return d.player_positions != ("GK")
                }
            })
            .filter(function (d)
            {
                if (selected_team === "All teams") {
                    return (d.club == "Real Madrid" || d.club == "FC Barcelona" || d.club == "Paris-Saint Germain" || d.club == "FC Bayern M�nchen" || d.club == "Liverpool" || d.club == "Manchester United" || d.club == "Manchester City" || d.club == "Juventus" || d.club == "Atl�tico Madrid")
                }
                else {
                    return d.club == selected_team
                }
            })
            .attr("cx", function (d) {
                return xScale(d.age);
            })
            .attr("cy", function (d) {
                return yScale(d.pace);
            });

        // Call plot function
        points_func.plot(selected_dots, 1);

        //Mouseover function
        mouseOver(selected_dots);

        //Mouseout function
        mouseOut(selected_dots);

    })
}
