//Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let downloadedData = {}

d3.json(url).then(function(data) {
  console.log(data);
  downloadedData = data

  let dropdownMenu = d3.select("#selDataset");
  data.samples.forEach(function(item){
    dropdownMenu.append('option').attr('value', item.id).text(item.id)
  })
});
//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.


function optionChanged(selectedValue) {
  console.log(selectedValue);
  let selectedSampleData = downloadedData.samples.find(function(item){
    return item.id == selectedValue
  });

  let plotData = [
    {
      type: 'bar',
      x: selectedSampleData.sample_values.slice(0,10).reverse(),
      y: selectedSampleData.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
      text: selectedSampleData.otu_labels.slice(0,10).reverse(),
      orientation: 'h'
    }
  ]

  console.log(plotData);
  Plotly.newPlot('bar', plotData);

  // Display the sample metadata, i.e., an individual's demographic information.
  let metadata = downloadedData.metadata.find(function(item){
    return item.id == selectedValue
  });

  let metadataDisplay = d3.select("#sample-metadata");
  metadataDisplay.html(""); // Clear previous data

  Object.entries(metadata).forEach(([key, value]) => {
    metadataDisplay.append("p").text(`${key}: ${value}`);
  });

  createBubbleChart();
}
// Create a bubble chart that displays each sample.
// Use otu_ids for the x values.
// Use sample_values for the y values.
// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.

function createBubbleChart() {

  let selectedSampleData = downloadedData.samples.find(function(item){
    return item.id == d3.select("#selDataset").property("value")
  });
  console.log("&&&&&");
  console.log(selectedSampleData);

  let bubbleData = [
    {
      mode: 'markers',
      x: selectedSampleData.otu_ids,
      y: selectedSampleData.sample_values,
      text: selectedSampleData.otu_labels,
      marker: {
        size: selectedSampleData.sample_values,
        color: selectedSampleData.otu_ids,
        colorscale: 'Viridis'
      }
    }
  ];

  let layout = {
    title: 'Bubble Chart',
    showlegend: false,
    xaxis: {
      title: 'OTU IDs'
    },
    yaxis: {
      title: 'Sample Values'
    }
  };

  Plotly.newPlot('bubble', bubbleData, layout);
}
