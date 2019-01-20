function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

  var url = "/metadata/" + sample;
  d3.json(url).then(function(sample) {
    var sample_metadata = d3.select ("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampl).forEach(([key, value])=>{
      var row = sample_metadata.append("p");
      row.text(`${key}:${value}`);

    })
  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    // https://plot.ly/javascript/bubble-charts/
    var xValues=data.otu_ids;
    var yValues=data.sample_values;
    var textValues=data.otu_labels;
    var markerSize=data.sample_values;
    var markerColors=data.otu_ids;

    // setting up trace as 'traceBubble'
    var traceBubble = {
      x:xValues,
      y:yValues,
      text:textValues,
      mode: 'markers',
      marker:{
        size:markerSize,
        color:markerColors
      }
    };

    var data=[traceBubble];
    var layout={
      xaxis:{title:"OUT ID"}
    };

    // sets up Plotyly - ties to bubble div in index.html
    Plotly.newPlot('bubble',data,layout);
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    //https://plot.ly/javascript/pie-charts/
    // setup variables and slices
    d3.json(url).then(function(data){
      var pieValues=data.sample_values.slice(0,10);
      var pieLabels=data.otu_ids.slice(0,10);
      var pieHovering=data.otu_labels.slice(0,10);

      
      var data = [{
        values:pieValues,
        labels:pieLabels,
        hovertext:pieHovering,
        type:'pie'
      }];

      // ties to pie div in index.html
      Plotly.newPlot('pie',data);
    }];
  }];
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
