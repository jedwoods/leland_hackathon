window.onload = function () {
    const table = document.getElementById("dataTable"); // Table with contact data
    const contactDates = [];
    const today = new Date();

    // Loop through the table rows to get "Last Contact" column (assuming it's the 5th column, index 4)
    for (let row of table.rows) {
        const dateStr = row.cells[4]?.textContent; // Assuming the 5th column (index 4) is "Last Contact"
        if (dateStr) {
            const contactDate = new Date(dateStr);
            // Only include contacts from the last 7 days
            if (contactDate >= new Date(today.setDate(today.getDate() - 7))) {
                contactDates.push(contactDate.toLocaleDateString());
            }
        }
    }

    // Group dates by day and count occurrences
    const contactCounts = contactDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    // Get the last 7 days
    const last7Days = [];
    const dateLabels = [];
    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(day.getDate() - i);
        const formattedDate = day.toLocaleDateString();
        last7Days.push(contactCounts[formattedDate] || 0); // Default to 0 if no contact on that day
        dateLabels.push(formattedDate);
    }

    // Create the chart using Chart.js
    const ctx = document.getElementById("myAreaChart").getContext("2d");
    new Chart(ctx, {
        type: "line",  // Line chart to show contacts over the last week
        data: {
            labels: dateLabels, // Last 7 days as labels
            datasets: [{
                label: "Contacts Received",
                data: last7Days, // Count of contacts for each day
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                fill: true,
                tension: 0.4 // Smooth line
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Date"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Number of Contacts"
                    }
                }
            },
            plugins: {
                legend: {
                    position: "top"
                }
            }
        }
    });
};
