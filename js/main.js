
var focus_plus_context, points, pc;

data = "./data/players_20.csv";


// ***** PART 1 : SCATTERPLOT *****

d3.csv(data, function (data)
{
	points = new Points();                               

	focus_plus_context = new focusPlusContext(data);     

})


// ***** PART 2 : CLUSTERING *****

queue()
	.defer(d3.csv, 'data/players_20.csv')
	.await(draw);

function draw(error, data1)
{
	if (error) throw error;

	pc = new pc(data1);
}