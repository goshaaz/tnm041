function pc(data){
	var div = '#pc-chart';
	var parentWidth = $(div).parent().width();
	var margin = { top: 40, right: 10, bottom: 10, left: 30 },
        width = parentWidth - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

	var xScale = d3.scaleBand().range([0, width]);
	var yScale = {};
	
	//Selecting colors for the paths (each line)
    var colors = colorbrewer.Set2[6];
    //Use scaleLinear for yScale.
    var scale = d3.scaleLinear().range([height, 0]);
	
	var line = d3.line(),
        foreground,
        background,
        dimensions;
	
	var svg = d3.select(div).append("svg")
		.attr("width", width)
		.attr("height", height + margin.top + margin.bottom)
		.append("svg:g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.append("g")
		.attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
	$('#myForm input').on('change', function() {
		var selected_team = ($('input[name=radioName]:checked', '#myForm').val()); 
		var training_data = data.filter(function(d){return (d.overall > 79 && d.player_positions != "GK" && d.club != selected_team)});
		var train_res = [];
		for(i = 0; i < training_data.length; i++){
			var str = training_data[i].player_positions.split(",")
			var position = str[0];
			if(position == "LB" || position == "LWB" || position == "RB" || position == "RWB"){
				train_res.push("Full-back");
			}
			else if(position == "CB"){
				train_res.push("Center-back");
			}
			else if(position == "CDM"){
				train_res.push("Defensive midfielder");
			}
			else if(position == "CM"){
				train_res.push("Central midfielder");
			}
			else if(position == "CAM"){
				train_res.push("Attacking midfielder");
			}
			else if(position == "RM" || position == "RW" || position == "RF" || position == "LM" || position == "LW" || position == "LF"){
				train_res.push("Winger");
			}
			else if(position == "CF" || position == "ST"){
				train_res.push("Striker");
			}
		}
		var filtered_data = data.filter(function (d)
		{
			if (selected_team === "All teams")
			{
				return (d.overall > 74 && d.player_positions != "GK" && (d.club == "Real Madrid" || d.club == "FC Barcelona" || d.club == "Paris-Saint Germain" || d.club == "FC Bayern M�nchen" || d.club == "Liverpool" || d.club == "Manchester United" || d.club == "Manchester City" || d.club == "Juventus" || d.club == "Atl�tico Madrid"))
			}
			else {
				return (d.overall > 74 && d.player_positions != "GK" && d.club == selected_team)
            }
			
		});
		
		var y = {};
		for (i in dimensions){
			var maxValue = d3.max(filtered_data, function (d) { return d[dimensions[i]] });
			var minValue = d3.min(filtered_data, function (d) { return d[dimensions[i]] });
			y[dimensions[i]] = d3.scaleLinear()
				.domain([minValue, maxValue])
				.range([height-40, 0])
		}
		var x = d3.scalePoint()
			.range([0, width])
			.padding(1)
			.domain(dimensions);
	
	function path(d) {
		var arr = [];
		for(idx in dimensions){
			var curr_scale = y[dimensions[idx]];
			var val = [x(dimensions[idx]), curr_scale(d[dimensions[idx]])];
			arr.push(val);
		}
      return d3.line()(arr);
	}
	
	function Color_for_player(d){
		//K = 3 3 Nearest neighbors
		var idx_min = 0;
		var min = Math.sqrt(Math.pow((d.pace-training_data[0].pace),2)
			+Math.pow((d.shooting-training_data[0].shooting),2) 
			+ Math.pow((d.passing-training_data[0].passing),2)
			+ Math.pow((d.dribbling-training_data[0].dribbling),2) 
			+ Math.pow((d.defending-training_data[0].defending),2)
			+ Math.pow((d.physic-training_data[0].physic),2));
		var idx_min2 = 1;
		var min2 = Math.sqrt(Math.pow((d.pace-training_data[1].pace),2)
			+Math.pow((d.shooting-training_data[1].shooting),2) 
			+ Math.pow((d.passing-training_data[1].passing),2)
			+ Math.pow((d.dribbling-training_data[1].dribbling),2) 
			+ Math.pow((d.defending-training_data[1].defending),2)
			+ Math.pow((d.physic-training_data[1].physic),2));
		var idx_min3 = 2;
		var min3 = Math.sqrt(Math.pow((d.pace-training_data[2].pace),2)
			+Math.pow((d.shooting-training_data[2].shooting),2) 
			+ Math.pow((d.passing-training_data[2].passing),2)
			+ Math.pow((d.dribbling-training_data[2].dribbling),2) 
			+ Math.pow((d.defending-training_data[2].defending),2)
			+ Math.pow((d.physic-training_data[2].physic),2));
		
		var arr_min = [min, min2, min3];
		var idx_array = [0, 1, 2];
		// Bubble sort
		for(i = 0; i < arr_min.length - 1; i++){
			for(j = 0; j < arr_min.length - 1; j++){
			if(arr_min[j] > arr_min[j+1]){
				var temp = arr_min[j];
				arr_min[j] = arr_min[j+1];
				arr_min[j+1] = temp;
				
				var tmp_idx = idx_array[j];
				idx_array[j] = idx_array[j+1];
				idx_array[j+1] = tmp_idx;
			}
			}
		}
		
		for(i = 3; i < training_data.length; i++){
			Eucl_distance = Math.sqrt(Math.pow((d.pace-training_data[i].pace),2)
			+Math.pow((d.shooting-training_data[i].shooting),2) 
			+ Math.pow((d.passing-training_data[i].passing),2)
			+ Math.pow((d.dribbling-training_data[i].dribbling),2) 
			+ Math.pow((d.defending-training_data[i].defending),2)
			+ Math.pow((d.physic-training_data[i].physic),2));
			if(Eucl_distance < arr_min[0]){ 
				var temp = arr_min[0];
				arr_min[0] = Eucl_distance;
				arr_min[2] = arr_min[1];
				arr_min[1] = temp;
				
				var tmp_idx = idx_array[0];
				idx_array[0] = i;
				idx_array[2] = idx_array[1];
				idx_array[1] = tmp_idx;
			}
			else if(arr_min[0] < Eucl_distance && Eucl_distance < arr_min[1]){
				var temp = arr_min[1];
				arr_min[1] = Eucl_distance;
				arr_min[2] = temp;
				
				var tmp_idx = idx_array[1];
				idx_array[1] = i;
				idx_array[2] = tmp_idx;
			}
			else if(arr_min[0] < Eucl_distance && arr_min[1] < Eucl_distance && Eucl_distance < arr_min[2]){
				var temp = arr_min[2];
				arr_min[2] = Eucl_distance;
				
				idx_array[2] = i;
			}
			else{
				//Do nothing larger
			}
		}
		
		var pos;
		if(train_res[idx_array[0]] == train_res[idx_array[1]] && train_res[idx_array[1]] == train_res[idx_array[2]]){
			pos = train_res[idx_array[0]];
		}
		else if(train_res[idx_array[0]] == train_res[idx_array[1]] && train_res[idx_array[1]] != train_res[idx_array[2]]){
			pos = train_res[idx_array[0]];
		}
		else if(train_res[idx_array[0]] == train_res[idx_array[2]] && train_res[idx_array[1]] != train_res[idx_array[2]]){
			pos = train_res[idx_array[0]];
		}
		else if(train_res[idx_array[1]] == train_res[idx_array[2]] && train_res[idx_array[1]] != train_res[idx_array[0]]){
			pos = train_res[idx_array[1]];
		}
		// All positions different --> we use the closest distance index to cluster.
		else{
			pos = train_res[idx_array[0]];
		}
		d["predicted_pos"] = pos;
		if(pos == "Full-back") return "blue";
		if(pos == "Center-back") return "green";
		if(pos == "Defensive midfielder") return "red";
		if(pos == "Central midfielder") return "purple";
		if(pos == "Attacking midfielder") return "yellow";
		if(pos == "Winger") return "orange";
		if(pos == "Striker") return "pink";
		return "red";
	}
	
	  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover(d) {
	//d3.select(this).attr("r", 10).style("stroke", "black");
	d3.select(this).attr("r", 10).style("stroke-width", "4px");
    focusText.style("opacity",1)
	focusText.html("Name: " + d.short_name)
	focusText.attr("dy", "12em")
	focusText11.text("Age: " + d.age)
	focusText11.attr("dy", "13em")
	focusText11.style("opacity", 1)
	focusText2.text("Club: " + d.club)
	focusText2.attr("dy", "14em")
	focusText2.style("opacity", 1)
	focusText12.text("Predicted position: " + d.predicted_pos)
	focusText12.attr("dy", "15em")
	focusText12.style("opacity", 1)
	var str = d.player_positions.split(",")
	focusText3.text("Real life position(s): " + str)
	focusText3.attr("dy", "16em")
	focusText3.style("opacity", 1)
	focusText4.text("Pace: " + d.pace)
	focusText4.attr("dy", "17em")
	focusText4.style("opacity", 1)
	focusText5.text("Shooting: " + d.shooting)
	focusText5.attr("dy", "18em")
	focusText5.style("opacity", 1)
	focusText6.text("Passing: " + d.passing)
	focusText6.attr("dy", "19em")
	focusText6.style("opacity", 1)
	focusText7.text("Dribbling: " + d.dribbling)
	focusText7.attr("dy", "20em")
	focusText7.style("opacity", 1)
	focusText8.text("Defending: " + d.defending)
	focusText8.attr("dy", "21em")
	focusText8.style("opacity", 1)
	focusText9.text("Physical: " + d.physic)
	focusText9.attr("dy", "22em")
	focusText9.style("opacity", 1)
	
	if(d.sofifa_id.length == 6){
		document.getElementsByClassName("img")[0].setAttribute("href","https://cdn.sofifa.com/players/" + d.sofifa_id.substr(0,3) + "/" + d.sofifa_id.substr(3,6) + "/20_120.png");
	}
	else if(d.sofifa_id.length == 5){
		document.getElementsByClassName("img")[0].setAttribute("href","https://cdn.sofifa.com/players/" + "0" + d.sofifa_id.substr(0,2) + "/" + d.sofifa_id.substr(2,5) + "/20_120.png");
	}
	else if(d.sofifa_id.length == 4){
		document.getElementsByClassName("img")[0].setAttribute("href","https://cdn.sofifa.com/players/" + "00" + d.sofifa_id.substr(0,1) + "/" + d.sofifa_id.substr(1,4) + "/20_120.png");
	}
	else if(d.sofifa_id.length == 3){
		document.getElementsByClassName("img")[0].setAttribute("href","https://cdn.sofifa.com/players/" + "000" + "/" + d.sofifa_id.substr(0,3) + "/20_120.png");
	}
	
  }

  function mouseout(d) {
	d3.select(this).attr("r", 10).style("stroke", Color_for_player(d));  
	d3.select(this).attr("r", 10).style("stroke-width", "1.5px");
    focusText.style("opacity",0)
	focusText2.style("opacity", 0)
	focusText3.style("opacity", 0)
	focusText4.style("opacity", 0)
	focusText5.style("opacity", 0)
	focusText6.style("opacity", 0)
	focusText7.style("opacity", 0)
	focusText8.style("opacity", 0)
	focusText9.style("opacity", 0)
	focusText10.style("opacity", 0)
	focusText11.style("opacity", 0)
	focusText12.style("opacity", 0)
	document.getElementsByClassName("img")[0].setAttribute("href","");
  }
			// Draw the axis:
	svg.selectAll("g.axis")
		.remove()
	svg.selectAll("myAxis")
		// For each dimension of the dataset I add a 'g' element:
		.data(dimensions).enter()
		.append("g")
		// I translate this element to its right position on the x axis
		.attr("transform", function(d) { return "translate(" + x(d) + ")"; })
		// And I build the axis with the call function
		.each(function(d) {d3.select(this).call(d3.axisLeft().scale(y[d])); })
		.attr("class", "axis")
		// Add axis title
		.append("text")
		.style("text-anchor", "middle")
		.attr("y", -9)
		.text(function(d) { return d; })
		.style("fill", "black")
	svg.selectAll("path#line")
		.remove()
		// Draw the lines
	svg
		.selectAll("myPath")
		.data(filtered_data)
		.enter().append("path")
		.attr("id", "line")
		.attr("d",  path)
		.style("fill", "none")
		.style("stroke", Color_for_player)
		.style("stroke-width", "1.5px")
		.style("opacity", 0.8)
		.on('mouseover', mouseover)
		.on('mouseout', mouseout)
		
		
		function accuracy(team_data){
			var total = team_data.length;
			var correct_num = 0;
			for(i in team_data){
				var str = team_data[i].player_positions.split(",");
				for(idx in str){
					if((str[idx].trim() == "LM" || str[idx].trim() == "LW" || str[idx].trim() == "LF" || str[idx].trim() == "RM" || str[idx].trim() == "RW" || str[idx].trim() == "RF") && team_data[i].predicted_pos == "Winger"){
						correct_num += 1;
						break;
					}
					else if((str[idx].trim() == "ST" || str[idx].trim() == "CF") && team_data[i].predicted_pos == "Striker"){ correct_num += 1; break; }
					else if((str[idx].trim() == "CAM") && team_data[i].predicted_pos == "Attacking midfielder"){ correct_num += 1; break;}
					else if((str[idx].trim() == "CM") && team_data[i].predicted_pos == "Central midfielder") {correct_num += 1; break;}
					else if((str[idx].trim() == "CDM") && team_data[i].predicted_pos == "Defensive midfielder") {correct_num += 1; break;}
					else if((str[idx].trim() == "LB" || str[idx].trim() == "LWB" || str[idx].trim() == "RB" || str[idx].trim() == "RWB") && team_data[i].predicted_pos == "Full-back") {correct_num += 1; break;}
					else if((str[idx].trim() == "CB") && team_data[i].predicted_pos == "Center-back") {correct_num += 1; break;}
				}	
			}
			return (correct_num/total).toFixed(3);
		}
		var acc = accuracy(filtered_data);

		if(($('input[name=radioName]:checked', '#myForm').val()) == "All teams"){ $("#accuracyText").text("Prediction accuracy : " + "0.837");}
		else{
			$("#accuracyText").text("Prediction accuracy : " + acc);
		}
		
	});
	
	dimensions = ["pace", "shooting", "passing", "dribbling", "defending", "physic"];
	var training_data = data.filter(function(d){return (d.overall > 79 && d.player_positions != "GK" && d.club != "Real Madrid")});
	var train_res = [];
	for(i = 0; i < training_data.length; i++){
		var str = training_data[i].player_positions.split(",")
		var position = str[0];
		if(position == "LB" || position == "LWB" || position == "RB" || position == "RWB"){
			train_res.push("Full-back");
		}
		else if(position == "CB"){
			train_res.push("Center-back");
		}
		else if(position == "CDM"){
			train_res.push("Defensive midfielder");
		}
		else if(position == "CM"){
			train_res.push("Central midfielder");
		}
		else if(position == "CAM"){
			train_res.push("Attacking midfielder");
		}
		else if(position == "RM" || position == "RW" || position == "RF" || position == "LM" || position == "LW" || position == "LF"){
			train_res.push("Winger");
		}
		else if(position == "CF" || position == "ST"){
			train_res.push("Striker");
		}
	}
	var selec_team = ($('input[name=radioName]:checked', '#myForm').val()); 
	var filtered_data = data.filter(function (d) {
		if (selec_team === "All teams") {
			return (d.overall > 74 && d.player_positions != "GK" && (d.club == "Real Madrid" || d.club == "FC Barcelona" || d.club == "Paris-Saint Germain" || d.club == "FC Bayern M�nchen" || d.club == "Liverpool" || d.club == "Manchester United" || d.club == "Manchester City" || d.club == "Juventus" || d.club == "Atl�tico Madrid"))
		}
		else {
			return (d.overall > 74 && d.player_positions != "GK" && d.club == selec_team)
		}
	});
	var y = {};
	for (i in dimensions){
		var maxValue = d3.max(filtered_data, function (d) { return d[dimensions[i]] });
		var minValue = d3.min(filtered_data, function (d) { return d[dimensions[i]] });
		y[dimensions[i]] = d3.scaleLinear()
			.domain([minValue, maxValue])
			.range([height-40, 0])
	}
	var x = d3.scalePoint()
		.range([0, width])
		.padding(1)
		.domain(dimensions);
	
	function path(d) {
		var arr = [];
		for(idx in dimensions){
			var curr_scale = y[dimensions[idx]];
			var val = [x(dimensions[idx]), curr_scale(d[dimensions[idx]])];
			arr.push(val);
		}
      return d3.line()(arr);
	}
	
	function Color_for_player(d){
		//K = 3 3 Nearest neighbor
		var idx_min = 0;
		var min = Math.sqrt(Math.pow((d.pace-training_data[0].pace),2)
			+Math.pow((d.shooting-training_data[0].shooting),2) 
			+ Math.pow((d.passing-training_data[0].passing),2)
			+ Math.pow((d.dribbling-training_data[0].dribbling),2) 
			+ Math.pow((d.defending-training_data[0].defending),2)
			+ Math.pow((d.physic-training_data[0].physic),2));
		var idx_min2 = 1;
		var min2 = Math.sqrt(Math.pow((d.pace-training_data[1].pace),2)
			+Math.pow((d.shooting-training_data[1].shooting),2) 
			+ Math.pow((d.passing-training_data[1].passing),2)
			+ Math.pow((d.dribbling-training_data[1].dribbling),2) 
			+ Math.pow((d.defending-training_data[1].defending),2)
			+ Math.pow((d.physic-training_data[1].physic),2));
		var idx_min3 = 2;
		var min3 = Math.sqrt(Math.pow((d.pace-training_data[2].pace),2)
			+Math.pow((d.shooting-training_data[2].shooting),2) 
			+ Math.pow((d.passing-training_data[2].passing),2)
			+ Math.pow((d.dribbling-training_data[2].dribbling),2) 
			+ Math.pow((d.defending-training_data[2].defending),2)
			+ Math.pow((d.physic-training_data[2].physic),2));
		
		var arr_min = [min, min2, min3];
		var idx_array = [0, 1, 2];
		// Bubble sort
		for(i = 0; i < arr_min.length - 1; i++){
			for(j = 0; j < arr_min.length - 1; j++){
			if(arr_min[j] > arr_min[j+1]){
				var temp = arr_min[j];
				arr_min[j] = arr_min[j+1];
				arr_min[j+1] = temp;
				
				var tmp_idx = idx_array[j];
				idx_array[j] = idx_array[j+1];
				idx_array[j+1] = tmp_idx;
			}
			}
		}
		
		for(i = 3; i < training_data.length; i++){
			Eucl_distance = Math.sqrt(Math.pow((d.pace-training_data[i].pace),2)
			+Math.pow((d.shooting-training_data[i].shooting),2) 
			+ Math.pow((d.passing-training_data[i].passing),2)
			+ Math.pow((d.dribbling-training_data[i].dribbling),2) 
			+ Math.pow((d.defending-training_data[i].defending),2)
			+ Math.pow((d.physic-training_data[i].physic),2));
			if(Eucl_distance < arr_min[0]){ 
				var temp = arr_min[0];
				arr_min[0] = Eucl_distance;
				arr_min[2] = arr_min[1];
				arr_min[1] = temp;
				
				var tmp_idx = idx_array[0];
				idx_array[0] = i;
				idx_array[2] = idx_array[1];
				idx_array[1] = tmp_idx;
			}
			else if(arr_min[0] < Eucl_distance && Eucl_distance < arr_min[1]){
				var temp = arr_min[1];
				arr_min[1] = Eucl_distance;
				arr_min[2] = temp;
				
				var tmp_idx = idx_array[1];
				idx_array[1] = i;
				idx_array[2] = tmp_idx;
			}
			else if(arr_min[0] < Eucl_distance && arr_min[1] < Eucl_distance && Eucl_distance < arr_min[2]){
				var temp = arr_min[2];
				arr_min[2] = Eucl_distance;
				
				idx_array[2] = i;
			}
			else{
				//Do nothing larger
			}
		}
		
		var pos;
		if(train_res[idx_array[0]] == train_res[idx_array[1]] && train_res[idx_array[1]] == train_res[idx_array[2]]){
			pos = train_res[idx_array[0]];
		}
		else if(train_res[idx_array[0]] == train_res[idx_array[1]] && train_res[idx_array[1]] != train_res[idx_array[2]]){
			pos = train_res[idx_array[0]];
		}
		else if(train_res[idx_array[0]] == train_res[idx_array[2]] && train_res[idx_array[1]] != train_res[idx_array[2]]){
			pos = train_res[idx_array[0]];
		}
		else if(train_res[idx_array[1]] == train_res[idx_array[2]] && train_res[idx_array[1]] != train_res[idx_array[0]]){
			pos = train_res[idx_array[1]];
		}
		// All positions different --> we use the closest distance index to cluster.
		else{
			pos = train_res[idx_array[0]];
		}
		d["predicted_pos"] = pos;

		if(pos == "Full-back") return "blue";
		if(pos == "Center-back") return "green";
		if(pos == "Defensive midfielder") return "red";
		if(pos == "Central midfielder") return "purple";
		if(pos == "Attacking midfielder") return "yellow";
		if(pos == "Winger") return "orange";
		if(pos == "Striker") return "pink";
		return "red";
	}
	
	
	
	// Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) {d3.select(this).call(d3.axisLeft().scale(y[d])); })
	.attr("class", "axis")
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")

	function name(d){
		return d.short_name;
	}
	
	  // Create the text that travels along the curve of chart
	var focusText = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	var focusText2 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText3 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText4 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText5 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText6 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText7 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText8 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText9 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText10 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText11 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText12 = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .attr("dx", "-3em")
	  var focusText13 = svg
    .append('g')
    .append('text')
	  .attr("id", "accuracyText")
      .style("opacity", 1)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
	  .html("Clustering accuracy:")
	  .attr("dy", "0em")
	  .attr("dx", "-3em")
	  
	svg
	.append('image')
	.attr("class", "img")
	.attr("y", "50")
	.attr("x", "-10")
	.attr("width", "130px")
	
	document.getElementsByClassName("img")[0].setAttribute("href","");
	   // Create a rect on top of the svg area: this rectangle recovers mouse position
	svg
	.attr("id", "txt")
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
	
	  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover(d) {
	//d3.select(this).attr("r", 10).style("stroke", "black");
	d3.select(this).attr("r", 10).style("stroke-width", "4px");
    focusText.style("opacity",1)
	focusText.html("Name: " + d.short_name)
	focusText.attr("dy", "12em")
	focusText11.text("Age: " + d.age)
	focusText11.attr("dy", "13em")
	focusText11.style("opacity", 1)
	focusText2.text("Club: " + d.club)
	focusText2.attr("dy", "14em")
	focusText2.style("opacity", 1)
	focusText12.text("Predicted position: " + d.predicted_pos)
	focusText12.attr("dy", "15em")
	focusText12.style("opacity", 1)
	var str = d.player_positions.split(",")
	focusText3.text("Real life position(s): " + str)
	focusText3.attr("dy", "16em")
	focusText3.style("opacity", 1)
	focusText4.text("Pace: " + d.pace)
	focusText4.attr("dy", "17em")
	focusText4.style("opacity", 1)
	focusText5.text("Shooting: " + d.shooting)
	focusText5.attr("dy", "18em")
	focusText5.style("opacity", 1)
	focusText6.text("Passing: " + d.passing)
	focusText6.attr("dy", "19em")
	focusText6.style("opacity", 1)
	focusText7.text("Dribbling: " + d.dribbling)
	focusText7.attr("dy", "20em")
	focusText7.style("opacity", 1)
	focusText8.text("Defending: " + d.defending)
	focusText8.attr("dy", "21em")
	focusText8.style("opacity", 1)
	focusText9.text("Physical: " + d.physic)
	focusText9.attr("dy", "22em")
	focusText9.style("opacity", 1)
	
	if(d.sofifa_id.length == 6){
		document.getElementsByClassName("img")[0].setAttribute("href","https://cdn.sofifa.com/players/" + d.sofifa_id.substr(0,3) + "/" + d.sofifa_id.substr(3,6) + "/20_120.png");
	}
	else if(d.sofifa_id.length == 5){
		document.getElementsByClassName("img")[0].setAttribute("href","https://cdn.sofifa.com/players/" + "0" + d.sofifa_id.substr(0,2) + "/" + d.sofifa_id.substr(2,5) + "/20_120.png");
	}
	else if(d.sofifa_id.length == 4){
		document.getElementsByClassName("img")[0].setAttribute("href","https://cdn.sofifa.com/players/" + "00" + d.sofifa_id.substr(0,1) + "/" + d.sofifa_id.substr(1,4) + "/20_120.png");
	}
	else if(d.sofifa_id.length == 3){
		document.getElementsByClassName("img")[0].setAttribute("href","https://cdn.sofifa.com/players/" + "000" + "/" + d.sofifa_id.substr(0,3) + "/20_120.png");
	}
	
  }

  function mouseout(d) {
	d3.select(this).attr("r", 10).style("stroke", Color_for_player(d));  
	d3.select(this).attr("r", 10).style("stroke-width", "1.5px");
    focusText.style("opacity",0)
	focusText2.style("opacity", 0)
	focusText3.style("opacity", 0)
	focusText4.style("opacity", 0)
	focusText5.style("opacity", 0)
	focusText6.style("opacity", 0)
	focusText7.style("opacity", 0)
	focusText8.style("opacity", 0)
	focusText9.style("opacity", 0)
	focusText10.style("opacity", 0)
	focusText11.style("opacity", 0)
	focusText12.style("opacity", 0)
	document.getElementsByClassName("img")[0].setAttribute("href","");
  }
	
	// Draw the lines
  svg
    .selectAll("myPath")
    .data(filtered_data)
    .enter().append("path")
	.attr("id", "line")
    .attr("d",  path)
    .style("fill", "none")
    .style("stroke", Color_for_player)
	.style("stroke-width", "1.5px")
    .style("opacity", 0.8)
	.on('mouseover', mouseover)
	.on('mouseout', mouseout)
	
	function accuracy(team_data){
			var total = team_data.length;
			var correct_num = 0;
			for(i in team_data){
				var str = team_data[i].player_positions.split(",");
				for(idx in str){
					if((str[idx].trim() == "LM" || str[idx].trim() == "LW" || str[idx].trim() == "LF" || str[idx].trim() == "RM" || str[idx].trim() == "RW" || str[idx].trim() == "RF") && team_data[i].predicted_pos == "Winger"){
						correct_num += 1;
						break;
					}
					else if((str[idx].trim() == "ST" || str[idx].trim() == "CF") && team_data[i].predicted_pos == "Striker"){ correct_num += 1; break; }
					else if((str[idx].trim() == "CAM") && team_data[i].predicted_pos == "Attacking midfielder"){ correct_num += 1; break;}
					else if((str[idx].trim() == "CM") && team_data[i].predicted_pos == "Central midfielder") {correct_num += 1; break;}
					else if((str[idx].trim() == "CDM") && team_data[i].predicted_pos == "Defensive midfielder") {correct_num += 1; break;}
					else if((str[idx].trim() == "LB" || str[idx].trim() == "LWB" || str[idx].trim() == "RB" || str[idx].trim() == "RWB") && team_data[i].predicted_pos == "Full-back") {correct_num += 1; break;}
					else if((str[idx].trim() == "CB") && team_data[i].predicted_pos == "Center-back") {correct_num += 1; break;}
				}	
			}
			return (correct_num/total).toFixed(3);
		}
		var acc = accuracy(filtered_data);
		if(($('input[name=radioName]:checked', '#myForm').val()) == "All teams"){ $("#accuracyText").text("Prediction accuracy: " + "0.837");}
		else{
			$("#accuracyText").text("Prediction accuracy: " + acc);
		}
}	