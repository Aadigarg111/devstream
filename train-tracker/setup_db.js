const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data dir exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const dbPath = path.join(dataDir, 'trains.db');
const db = new sqlite3.Database(dbPath);

console.log("🏗️ Building High-Performance Database...");

db.serialize(() => {
    // Create Tables
    db.run("CREATE TABLE IF NOT EXISTS trains (number TEXT PRIMARY KEY, name TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS stations (code TEXT PRIMARY KEY, name TEXT, lat REAL, lng REAL)");
    db.run("CREATE TABLE IF NOT EXISTS schedule (train_no TEXT, station_code TEXT, time TEXT, stop_order INTEGER)");
    
    // Create Indexes
    db.run("CREATE INDEX IF NOT EXISTS idx_trains_name ON trains(name)");
    db.run("CREATE INDEX IF NOT EXISTS idx_schedule_train ON schedule(train_no)");

    console.log("✅ Tables Created.");

    // Helper function
    const insertTrain = (number, name, route) => {
        db.run("INSERT OR REPLACE INTO trains VALUES (?, ?)", [number, name]);
        route.forEach((stop, idx) => {
            db.run("INSERT OR REPLACE INTO stations VALUES (?, ?, ?, ?)", [stop.c, stop.n, stop.lat, stop.lng]);
            db.run("INSERT OR REPLACE INTO schedule VALUES (?, ?, ?, ?)", [number, stop.c, stop.t, idx]);
        });
    };

    // --- 22222 CSMT Rajdhani ---
    insertTrain("22222", "CSMT RAJDHANI", [
        {c:"CSMT", n:"Mumbai CSMT", t:"16:00", lat:18.9400, lng:72.8353},
        {c:"KYN", n:"Kalyan Jn", t:"16:43", lat:19.2396, lng:73.1293},
        {c:"NK", n:"Nashik Road", t:"18:17", lat:19.9537, lng:73.8298},
        {c:"JL", n:"Jalgaon Jn", t:"20:48", lat:21.0029, lng:75.5627},
        {c:"BPL", n:"Bhopal Jn", t:"00:35", lat:23.2599, lng:77.4126},
        {c:"VGLJ", n:"VGL Jhansi Jn", t:"04:31", lat:25.4484, lng:78.5685},
        {c:"GWL", n:"Gwalior Jn", t:"05:50", lat:26.2183, lng:78.1828},
        {c:"AGC", n:"Agra Cantt", t:"07:15", lat:27.1610, lng:77.9959},
        {c:"NZM", n:"Hazrat Nizamuddin", t:"09:55", lat:28.5902, lng:77.2505}
    ]);

    // --- 12002 Bhopal Shatabdi ---
    insertTrain("12002", "BHOPAL SHATABDI", [
        {c:"NDLS", n:"New Delhi", t:"06:00", lat:28.6427, lng:77.2210},
        {c:"AGC", n:"Agra Cantt", t:"07:50", lat:27.1610, lng:77.9959},
        {c:"GWL", n:"Gwalior", t:"09:23", lat:26.2183, lng:78.1828},
        {c:"VGLJ", n:"VGL Jhansi", t:"10:45", lat:25.4484, lng:78.5685},
        {c:"BPL", n:"Bhopal", t:"14:05", lat:23.2599, lng:77.4126}
    ]);

    // --- 12951 Mumbai Rajdhani ---
    insertTrain("12951", "MUMBAI RAJDHANI", [
        {c:"MMCT", n:"Mumbai Central", t:"17:00", lat:18.9696, lng:72.8193},
        {c:"ST", n:"Surat", t:"19:43", lat:21.1702, lng:72.8311},
        {c:"BRC", n:"Vadodara Jn", t:"21:13", lat:22.3106, lng:73.1811},
        {c:"RTM", n:"Ratlam Jn", t:"00:45", lat:23.3344, lng:75.0487},
        {c:"KOTA", n:"Kota Jn", t:"04:10", lat:25.2138, lng:75.8648},
        {c:"NDLS", n:"New Delhi", t:"08:32", lat:28.6427, lng:77.2210}
    ]);

    // --- 12260 SDAH Duronto ---
    insertTrain("12260", "SDAH DURONTO", [
        {c:"BKN", n:"Bikaner Jn", t:"12:15", lat:28.0229, lng:73.3119},
        {c:"NDLS", n:"New Delhi", t:"19:25", lat:28.6427, lng:77.2210},
        {c:"CNB", n:"Kanpur Central", t:"00:50", lat:26.4547, lng:80.3506},
        {c:"DDU", n:"Pt DD Upadhyaya", t:"05:35", lat:25.2813, lng:83.1306},
        {c:"SDAH", n:"Sealdah", t:"12:45", lat:22.5697, lng:88.3697}
    ]);

    console.log("🚀 Database Ready!");
});

db.close();