
//We first have to create a dataset for the circules with some information
var circleData = [
    { "cx": 30, "cy": 40, "radius": 12, "color": "#e8e15f", "text": "Defenders" },         // The defenfers in yellow
    { "cx": 30, "cy": 80, "radius": 12, "color": "#3ccf5e", "text": "Midfielders" },       // The midfielders in green
    { "cx": 30, "cy": 120, "radius": 12, "color": "#eb4444", "text": "Attackers" }         // The attackers in red
];

//Then get width and height of the parent
var width = $("#color-info").parent().width();
var height = $("#color-info").parent().height() - 30;


//Then we create the SVG Viewport
var svgContainer = d3.select("#color-info")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


//After we add circles to the svgContainer
var circles = svgContainer.selectAll("circle")
    .data(circleData)
    .enter()
    .append("circle");


//And some circle attributes
var circleAttributes = circles
    .attr("cx", function (d) { return d.cx; })
    .attr("cy", function (d) { return d.cy; })
    .attr("r", function (d) { return d.radius; })
    .style("fill", function (d) { return d.color; });


//Also adding some text to the svgContainer
var text = svgContainer.selectAll("text")
    .data(circleData)
    .enter()
    .append("text");


//And lastly adding the SVG Text Element Attributes
var textLabels = text
    .attr("x", function (d) { return d.cx + 30; })
    .attr("y", function (d) { return d.cy + 3; })
    .text(function (d) { return d.text; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("fill", "black");

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}