// Publish Data from truck devices - iot.js

/*
* Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

// Require AWS IoT Device SDK
const awsIoT = require('aws-iot-device-sdk');

// Require crypto for random numbers generation
const crypto = require('crypto');

// Load the endpoint from file
const endpointFile = require('./endpoint.json');

// Fetch the deviceName from the folder name
const deviceName = __dirname.split('/').pop();

// Create the thingShadow object with argument data
const device = awsIoT.device({
   keyPath: 'private.pem.key',
  certPath: 'certificate.pem.crt',
    caPath: 'root-CA.crt',
  clientId: deviceName,
      host: endpointFile.endpointAddress
});

// Function that gets executed when the connection to IoT is established
device.on('connect', function() {
    console.log('Connected to AWS IoT');
    
    // Start the publish loop
    infiniteLoopPublish();
});

// Function sending truck telemetry data every 5 seconds
function infiniteLoopPublish() {
    console.log('Sending truck telemetry data to AWS IoT for ' + deviceName);
    // Publish truck data to truck/telemetry topic with gettruckData
    device.publish("truck/telemetry", JSON.stringify(gettruckData(deviceName)));
    
    // Start Infinite Loop of Publish every 5 seconds
    setTimeout(infiniteLoopPublish, 5000);
}

// Function to create a random float between minValue and maxValue
function randomFloatBetween(minValue,maxValue){
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue));
}

// Generate random truck data based on the deviceName
function gettruckData(deviceName) {
    let message = {
        'trip_id': crypto.randomBytes(15).toString('hex'),
        'engine_speed_mean': randomFloatBetween(700.55555, 3000.55555),
        'fuel_level': randomFloatBetween(0, 100),
        'high_acceleration_event': randomFloatBetween(0, 12),
        'high_breaking_event': randomFloatBetween(0, 4),
        'odometer': randomFloatBetween(0.374318249, 8.142630049),
        'oil_temp_mean': randomFloatBetween(12.7100589, 205.3165256)
    };
    
    // truck1: https://www.google.com/maps/place/47%C2%B036'00.1%22N+122%C2%B020'09.0%22W/@47.60004,-122.33582,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x5f6be33afc042eb6!8m2!3d47.60004!4d-122.33582
    // truck2: https://www.google.com/maps/place/42%C2%B037'41.2%22N+73%C2%B045'32.1%22W/@42.6281,-73.75891,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x87d1a356ba75e9d0!8m2!3d42.6281!4d-73.75891
    const device_data = { 
        'truck1': {
            'vin': 'ABC123DEF456',
            'latitude':47.60004,
            'longitude':-122.33582
        },
        'truck2': {
            'vin': 'GHI789JKL012',
            'latitude': 42.62810,
            'longitude': -73.75891
        }
    };
  
    message['vin'] = device_data[deviceName].vin;
    message['latitude'] = device_data[deviceName].latitude;
    message['longitude'] = device_data[deviceName].longitude;
    message['device'] = deviceName;
    message['datetime'] = new Date().toISOString().replace(/\..+/, '');
    
    return message;
}