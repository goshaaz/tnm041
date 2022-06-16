
// ************************************** FUNCTION FOR PLOTTING THE POINTS *****************************************


function Points()
{
    this.plot = function (selection, scale_coeff)    // scale_coeff = 3 for the context chart
                                                    // scale_coeff = 1 for the focus chart
                                                    // To reduce the size of the points on the context chart
    {
        selection

            //            ***************************** SIZE OF THE POINTS ************************************

            .attr('r', function (d)
            {
                return 18 / scale_coeff;           // r=18 for the focus chart ; r=6 for the context chart
            })

            //            ***************************** COLOR OF THE POINTS ************************************

            .attr('fill', function (d)
            {

                 // If the player is a defender --> YELLOW
                if ((d.player_positions.startsWith("RB")) || (d.player_positions.startsWith("LWB")) || (d.player_positions.startsWith("RWB")) || (d.player_positions.startsWith("LB")) || (d.player_positions.startsWith("CB")))
                {
                    return "#e8e15f";
                }

                // If the player is a midfielder --> GREEN
                if ((d.player_positions.startsWith("CDM")) || (d.player_positions.startsWith("CM")) || (d.player_positions.startsWith("CAM")) || (d.player_positions.startsWith("RM")) || (d.player_positions.startsWith("LM")))
                {
                    return "#3ccf5e";
                }

                // If the player is an attacker --> RED
                if ((d.player_positions.startsWith("RW")) || (d.player_positions.startsWith("LW")) || (d.player_positions.startsWith("RF")) || (d.player_positions.startsWith("LF")) || (d.player_positions.startsWith("CF")) || (d.player_positions.startsWith("ST")))
                {
                    return "#eb4444";
                }

                // If the player's position can't be determined --> BLACK
                else                       
                {
                    return "#4d4d4d";
                }
            })
    }


    //                             ************************ TOOLTIP FUNCTION ****************************************

    // Helper function for including information tool_tip
    // Defining tooltip for hovering points
    
    this.tooltip = function(d) 
    {
        var tooltip = d3.select("#tooltip")

        tooltip
            .select("#age")
            .text("Age: " + d.age)                       // Get age of the player

        tooltip
            .select("#player")
            .text("Player: " + d.short_name)             // Get name of the player

        tooltip
            .select("#height")
            .text("Height: " + d.height_cm + " cm")      // Get height of the player

        if (d.player_positions === ("GK"))               
        {
            tooltip
                .select("#pace")
                .text("Pace: No entry")
        }
        else                                             // Get pace of the player (if he's not a goalkeeper)
        {
            tooltip
                .select("#pace")
                .text("Pace: " + d.pace)                 
        }
    }
}
