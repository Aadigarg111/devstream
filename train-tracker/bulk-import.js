const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { fetchFromNTES } = require('./ntes-fetcher');

const dbPath = path.join(__dirname, 'data', 'trains.db');
const db = new sqlite3.Database(dbPath);

console.log("🔄 Starting NTES Bulk Import...");
console.log("⚠️  This will take 30-60 minutes. Running in background...");

let processed = 0;
let success = 0;
let failed = 0;

async function bulkImport() {
    // Get all train numbers from our existing DB
    db.all("SELECT DISTINCT number FROM trains ORDER BY number", async (err, trains) => {
        if (err || !trains) {
            console.error("❌ Could not get train list");
            return;
        }

        const total = trains.length;
        console.log(`📋 Found ${total} trains to update`);

        // Process in batches to avoid overwhelming the server
        for (let i = 0; i < trains.length; i++) {
            const trainNo = trains[i].number;
            
            try {
                // Fetch from NTES
                const data = await fetchFromNTES(trainNo);
                
                if (data && data.schedule && data.schedule.length > 0) {
                    // Update train name
                    db.run("UPDATE trains SET name = ? WHERE number = ?", [data.name, trainNo]);
                    
                    // Delete old schedule
                    db.run("DELETE FROM schedule WHERE train_no = ?", [trainNo]);
                    
                    // Insert new schedule
                    const stmt = db.prepare("INSERT INTO schedule VALUES (?, ?, ?, ?)");
                    data.schedule.forEach((stop, idx) => {
                        stmt.run(trainNo, stop.code, stop.time, idx);
                    });
                    stmt.finalize();
                    
                    success++;
                    console.log(`✅ [${i+1}/${total}] Updated ${trainNo} - ${data.name}`);
                } else {
                    failed++;
                    console.log(`⚠️  [${i+1}/${total}] No data for ${trainNo}`);
                }
                
                processed++;
                
                // Progress report every 100 trains
                if (processed % 100 === 0) {
                    console.log(`📊 Progress: ${processed}/${total} (${success} success, ${failed} failed)`);
                }
                
                // Rate limiting: wait 500ms between requests to avoid getting blocked
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                failed++;
                console.log(`❌ [${i+1}/${total}] Error fetching ${trainNo}: ${error.message}`);
            }
        }
        
        console.log("🎉 Bulk import complete!");
        console.log(`📊 Final: ${success} success, ${failed} failed out of ${total} total`);
        db.close();
    });
}

bulkImport();
