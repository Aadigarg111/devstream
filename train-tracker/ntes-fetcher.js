const axios = require('axios');
const cheerio = require('cheerio');

// Fetch train schedule from official Indian Railways NTES site
async function fetchFromNTES(trainNo) {
    try {
        // NTES form endpoint
        const url = 'https://enquiry.indianrail.gov.in/mntes/q';
        
        const response = await axios.post(url, 
            `trainNo=${trainNo}&jStation=&trnType=&dt=`, 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 10000
            }
        );

        const $ = cheerio.load(response.data);
        
        // Parse the schedule table
        const schedule = [];
        const trainName = $('table').first().find('tr').eq(1).find('td').eq(1).text().trim();
        
        // Find the schedule table (usually the second or third table)
        $('table').each((i, table) => {
            $(table).find('tr').each((j, row) => {
                const cells = $(row).find('td');
                if (cells.length >= 5 && j > 0) { // Skip header
                    const stationCode = cells.eq(1).text().trim();
                    const stationName = cells.eq(2).text().trim();
                    const arrival = cells.eq(3).text().trim() || '00:00';
                    const departure = cells.eq(4).text().trim() || '00:00';
                    
                    if (stationCode && stationName) {
                        schedule.push({
                            code: stationCode,
                            name: stationName,
                            arrival: arrival,
                            departure: departure,
                            time: departure !== '00:00' ? departure : arrival
                        });
                    }
                }
            });
        });

        if (schedule.length > 0) {
            return {
                trainNo: trainNo,
                name: trainName || `Train ${trainNo}`,
                schedule: schedule
            };
        }
        
        return null;
    } catch (error) {
        console.error('NTES fetch error:', error.message);
        return null;
    }
}

module.exports = { fetchFromNTES };
