const fs = require('fs');
const path = require('path');

// Get filename from command line argument or read from stdin
const inputFile = process.argv[2];

function filterTransactions(data) {
    // Filter out records that are missing email or credit card number
    return data.filter(record => record.email && record.credit_card_number);
}

function saveToCSV(data) {
    if (data.length === 0) {
        console.log("No valid records found.");
        return;
    }

    // Create filename based on current date
    const csvFilename = new Date().toISOString().split('T')[0] + ".csv";

    // Convert to CSV format
    const csvContent = ["name,email,credit_card_number"]
        .concat(data.map(record => `${record.name},${record.email},${record.credit_card_number}`))
        .join("\n");

    // Save file
    fs.writeFileSync(csvFilename, csvContent);
    console.log(`Filtered data saved to ${csvFilename}`);
}
fs.readFile(inputFile, 'utf8', (err, jsonData) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    try {
        const data = JSON.parse(jsonData);
        console.log("Raw Data:", data); // <--- ADD THIS
        const filteredData = filterTransactions(data);
        console.log("Filtered Data:", filteredData); // <--- ADD THIS
        saveToCSV(filteredData);
    } catch (parseError) {
        console.error("Invalid JSON:", parseError);
    }
});

// Read JSON data from file or stdin
if (inputFile) {
    // Option 1: Read from file
    fs.readFile(inputFile, 'utf8', (err, jsonData) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }
        try {
            const data = JSON.parse(jsonData);
            const filteredData = filterTransactions(data);
            saveToCSV(filteredData);
        } catch (parseError) {
            console.error("Invalid JSON:", parseError);
        }
    });
} else {
    // Option 2: Read from stdin
    let inputData = "";
    process.stdin.on("data", chunk => inputData += chunk);
    process.stdin.on("end", () => {
        try {
            const data = JSON.parse(inputData);
            const filteredData = filterTransactions(data);
            saveToCSV(filteredData);
        } catch (parseError) {
            console.error("Invalid JSON:", parseError);
        }
    });
}
