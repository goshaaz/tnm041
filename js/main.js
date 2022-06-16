
var focus_plus_context, points, pc;

data = "./data/players20.json";


// ***** PART 1 : SCATTERPLOT *****

d3.json(data, function (data)
{
	points = new Points();                               

	focus_plus_context = new focusPlusContext(data);     

})


// ***** PART 2 : CLUSTERING *****

queue()
	.defer(d3.json, 'data/players20.json')
	.await(draw);

function draw(error, data1)
{
	if (error) throw error;

	pc = new pc(data1);
}