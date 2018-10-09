


/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25, 16,2];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday','Monday'];

//const MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };

const data = DAYS.map( (x,i) => {
	return {'x': i, 'y': TEST_TEMPERATURES[i], 'name': x}
	});

class ScatterPlot {

	constructor(svg_id, dataset) {

		this.id = svg_id;
		this.data = dataset;

		this.box = [0, 0, 200, 100];

		var svgContainer = d3.select("#"+this.id);

		//var scales = this.scale();

		//this.plot(svgContainer, scales);

		var scales = this.scale_band();

		this.plot_bar(svgContainer, scales);

	}

	scale() {

        var x_scale = d3.scaleLinear()
			.domain([0, this.data.length-1])
			.range([this.box[0], this.box[2]]);


        var y_scale = d3.scaleLinear()
			.domain([0, d3.max(this.data, function(d) {return d.y})])
			.range([this.box[3], this.box[1]]);

        return {'x': x_scale, 'y': y_scale}

	}

	plot(svg, scales) {

		// Add black rectangle
		svg.append("rect")
			.attr("x", this.box[0])
			.attr("y", this.box[1])
			.attr("width", this.box[2]-this.box[0])
			.attr("height", this.box[3]+1)
			.style("fill", "black");

		// Add Points
        svg.append("g").selectAll("circle")
            .data(this.data)
            .enter().append("circle")
			.attr("cx", function(d) {
				return scales['x'](d.x);
			})
			.attr("cy", function(d) {
                return scales['y'](d.y);
			})
			.attr("r", 1.5)
			.style("fill", function(d) {
				if (d.y >= 23) {
					return "red";
				} else if (d.y <= 17) {
					return "blue";
				}
			})

		// Add x labels
		svg.selectAll("text")
			.data(this.data)
			.enter().append("text")
			.attr("x", function(d) {
				return scales['x'](d.x);
			})
			.attr("y", this.box[3]+7)
			.text(function(d) {
                return d.name;
            });


        // Add y labels
		svg.append("g")
            .attr("transform", "translate(5,0)")
            .call(d3.axisLeft(scales['y']));


	}

    scale_band() {

        var y_scale = d3.scaleLinear()
            .domain([0, d3.max(this.data, function(d) {return d.y})])
            .range([this.box[3], this.box[1]]);

        var x_scale_band = d3.scaleBand()
            .domain(this.data.map(d => d.x))
            .range([this.box[0], this.box[2]])
            .padding(0.1);

        return {'y': y_scale, 'x': x_scale_band}

    }

    plot_bar(svg, scales) {

        // Add black rectangle
        svg.append("rect")
            .attr("x", this.box[0])
            .attr("y", this.box[1])
            .attr("width", this.box[2]-this.box[0])
            .attr("height", this.box[3]+1)
            .style("fill", "black");


        // Add x labels
        svg.selectAll("text")
            .data(this.data)
            .enter().append("text")
            .attr("x", function(d) {
                return scales['x'](d.x) + scales['x'].bandwidth()/2;
            })
            .attr("y", this.box[3]+7)
            .text(function(d) {
                return d.name;
            });


        // Add y labels
        svg.append("g")
            .attr("transform", "translate(5,0)")
            .call(d3.axisLeft(scales['y']));

        // Add Points
		/*
        svg.append("g").selectAll("circle")
            .data(this.data)
            .enter().append("circle")
            .attr("cx", function(d) {
                return scales['x'](d.x);
            })
            .attr("cy", function(d) {
                return scales['y'](d.y);
            })
            .attr("r", 1.5)
            .style("fill", function(d) {
                if (d.y >= 23) {
                    return "red";
                } else if (d.y <= 17) {
                    return "blue";
                }
            })
            */

		svg.append("g").selectAll("rect")
			.data(this.data)
			.enter().append("rect")
			.attr("x", function(d) {
				console.log(scales['x'](d.x));
				return scales['x'](d.x);
			})
			.attr("y", d => scales['y'](d.y))
			.attr("height", d=> scales['y'](0) - scales['y'](d.y))
            .attr("width", scales['x'].bandwidth())
            .style("fill", function(d) {
                if (d.y >= 23) {
                    return "red";
                } else if (d.y <= 17) {
                    return "blue";
                } else {
                	return "white";
				}
            });


    }

}

whenDocumentLoaded(() => {

	// prepare the data here

	//console.log(data);

	const plot = new ScatterPlot('plot', data);
});

