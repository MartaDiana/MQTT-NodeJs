const express = require('express');
const mqtt = require('mqtt');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const topics = 'sensor1';

// Koneksi ke MySQL (XAMPP default)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',         // default XAMPP: tanpa password
  database: 'iotdb'
});

// Koneksi ke MQTT
const mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.on('connect', () => {
  console.log('Terhubung ke broker MQTT');
  mqttClient.subscribe(topics, (err) => {
    if (!err) console.log(`Berhasil subscribe ke topik ${topics}`);
  });
});

// Terima pesan MQTT dan simpan ke database
mqttClient.on('message', (topic, message) => {
  if (topic === topics) {
    const suhu = parseFloat(message.toString());
    console.log(`Pesan dari ${topics}: ${suhu}`);

    const sql = 'INSERT INTO sensor_data (suhu) VALUES (?)';
    db.query(sql, [suhu], (err, result) => {
      if (err) return console.error('Gagal simpan ke database:', err.message);
      console.log('Data berhasil disimpan ke MySQL');
    });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
