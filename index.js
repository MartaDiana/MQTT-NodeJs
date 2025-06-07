const express = require('express');
const mqtt = require('mqtt');
const mysql = require('mysql2');
const app = express();
const port = 3000;

//db
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',         
  database: 'iot-dskr'
});

// Koneksi ke broker MQTT (localhost atau IP)
const mqttClient = mqtt.connect('mqtt://192.168.178.187:1883'); 
const topics = 'sensor1'


mqttClient.on('connect', () => {  
  console.log('Terhubung ke MQTT broker');
  mqttClient.subscribe(topics, (err) => {
    if (!err) {
      console.log(`Berhasil subscribe ke topik ${topics}`);
    }
    else {
       console.error('Gagal subscribe:', err.message);
    }
  });
});

mqttClient.on('message', (topics, message) => {
  console.log(typeof message);
  const Sensor1 = message.toString();
  console.log(`Pesan dari ${topics}: ${Sensor1}`);

  const sql = 'INSERT INTO sensor (Sensor1) VALUES (?)';
  db.query(sql, [Sensor1], (err, result) => {
    if (err) return console.error('Gagal simpan ke database:', err.message);
    console.log('Data berhasil disimpan ke MySQL');
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
