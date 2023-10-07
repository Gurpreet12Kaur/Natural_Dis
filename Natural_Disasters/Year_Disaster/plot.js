// Include the necessary libraries (ensure that Chart.js is included in your HTML)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>

// Function to fetch and display the chart
function createChart() {
    // Load the CSV data using PapaParse
    Papa.parse("output.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            var data = results.data;

            // Extract the "Year" and "Disaster Type" columns
            var years = data.map(function(row) {
                return row["Year"];
            });

            var disasterTypes = data.map(function(row) {
                return row["Disaster Type"];
            });

            // Create a context for the chart
            var ctx = document.getElementById('barChart').getContext('2d');

            // Create the bar chart
            var chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Disaster Types',
                        data: disasterTypes,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Year'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Disaster Type'
                            }
                        }
                    }
                }
            });
        }
    });
}

// Call the createChart function when the document is ready
document.addEventListener("DOMContentLoaded", createChart);
