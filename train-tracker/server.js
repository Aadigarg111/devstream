const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { fetchFromNTES } = require('./ntes-fetcher');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Open Database
const dbPath = path.join(__dirname, 'data', 'trains.db');
const db = new sqlite3.Database(dbPath);

console.log("🚀 Train Server (SQLite + NTES Live) Starting on Port " + PORT);

// Station coordinates cache (for NTES lookups)
const stationCache = {};

// API: Search Trains
app.get('/api/trains', (req, res) => {
    const query = req.query.q || '';
    if (!query || query.length < 2) return res.json([]);

    const sql = `SELECT number, name FROM trains WHERE number LIKE ? OR name LIKE ? LIMIT 10`;
    db.all(sql, [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) return res.json([]);
        res.json(rows);
    });
});

// API: Get Train Schedule
app.get('/api/train/:trainNo', async (req, res) => {
    const trainNo = req.params.trainNo;
    
    // 1. Try Local Database First
    db.get("SELECT * FROM trains WHERE number = ?", [trainNo], async (err, train) => {
        if (!err && train) {
            // Get schedule from local DB
            const sql = `
                SELECT s.code, s.name, s.lat, s.lng, sch.time 
                FROM schedule sch
                JOIN stations s ON sch.station_code = s.code
                WHERE sch.train_no = ?
                ORDER BY sch.time ASC
            `;
            
            db.all(sql, [trainNo], (err, rows) => {
                if (!err && rows.length > 0) {
                    return res.json({
                        trainNo: train.number,
                        name: train.name,
                        source: 'local',
                        route: rows.map(r => ({
                            code: r.code,
                            name: r.name,
                            time: r.time,
                            lat: r.lat,
                            lng: r.lng
                        }))
                    });
                }
                // No local data, try NTES
                tryNTES();
            });
        } else {
            // Not in DB, try NTES
            tryNTES();
        }
    });

    // 2. Fallback to NTES (Live Official Data)
    async function tryNTES() {
        console.log(`Fetching ${trainNo} from NTES...`);
        const ntesData = await fetchFromNTES(trainNo);
        
        if (!ntesData || !ntesData.schedule) {
            return res.status(404).json({ error: "Train not found" });
        }

        // Now we need to get coordinates for each station
        // We'll check our local stations DB first, then skip stations without coords
        const route = [];
        
        for (const stop of ntesData.schedule) {
            // Check if we have this station in our DB
            const coords = await new Promise((resolve) => {
                db.get("SELECT lat, lng FROM stations WHERE code = ?", [stop.code], (err, row) => {
                    if (row) resolve({ lat: row.lat, lng: row.lng });
                    else resolve(null);
                });
            });
            
            if (coords) {
                route.push({
                    code: stop.code,
                    name: stop.name,
                    time: stop.time,
                    lat: coords.lat,
                    lng: coords.lng
                });
            }
        }

        if (route.length === 0) {
            return res.status(404).json({ error: "No coordinates found for stations" });
        }

        res.json({
            trainNo: trainNo,
            name: ntesData.name,
            source: 'ntes',
            route: route
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚂 Ready at http://localhost:${PORT}`);
});