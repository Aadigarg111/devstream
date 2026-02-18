const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'trains.db');
const db = new sqlite3.Database(dbPath);

console.log("🚀 Starting MASSIVE Import (This will take 1-2 minutes)...");

// Use a transaction for speed (inserts 1000x faster)
db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const stmtTrain = db.prepare("INSERT OR IGNORE INTO trains VALUES (?, ?)");
    const stmtStn = db.prepare("INSERT OR IGNORE INTO stations VALUES (?, ?, ?, ?)");
    const stmtSch = db.prepare("INSERT OR IGNORE INTO schedule VALUES (?, ?, ?, ?)");

    try {
        // 1. IMPORT STATIONS
        console.log("📦 Importing Stations...");
        const stationsPath = path.join(__dirname, 'data', 'stations.json');
        if (fs.existsSync(stationsPath)) {
            const raw = JSON.parse(fs.readFileSync(stationsPath, 'utf8'));
            raw.features.forEach(f => {
                if (f.properties && f.properties.code && f.geometry) {
                    stmtStn.run(
                        f.properties.code, 
                        f.properties.name, 
                        f.geometry.coordinates[1], // Lat
                        f.geometry.coordinates[0]  // Lng
                    );
                }
            });
        }

        // 2. IMPORT TRAINS & SCHEDULES
        console.log("🚂 Importing Trains & Schedules (Huge file)...");
        const schedulesPath = path.join(__dirname, 'data', 'schedules.json');
        if (fs.existsSync(schedulesPath)) {
            const raw = JSON.parse(fs.readFileSync(schedulesPath, 'utf8'));
            // Raw is array of stops. We need to extract unique trains first.
            
            // Map to track which trains we've already inserted
            const seenTrains = new Set();

            raw.forEach((stop, idx) => {
                // Insert Train Info (if new)
                if (!seenTrains.has(stop.train_number)) {
                    stmtTrain.run(stop.train_number, stop.train_name || "Unknown Express");
                    seenTrains.add(stop.train_number);
                }

                // Insert Schedule Stop
                // time fallback: departure -> arrival -> 00:00
                let time = stop.departure;
                if (time === "None" || !time) time = stop.arrival;
                if (time === "None" || !time) time = "00:00:00";
                
                // Truncate time to HH:MM
                time = time.substring(0, 5);

                stmtSch.run(stop.train_number, stop.station_code, time, idx); // Use loop index as rough order if stop_number missing
                // Also insert stop_number if available (some files have it)
                if (stop.stop_number) stmtSch.run(stop.train_number, stop.station_code, time, stop.stop_number);
            });
        }
        
    } catch (err) {
        console.error("❌ Error during import:", err.message);
    }

    db.run("COMMIT");
    console.log("✅ Import Complete!");
    stmtTrain.finalize();
    stmtStn.finalize();
    stmtSch.finalize();
});

db.close();