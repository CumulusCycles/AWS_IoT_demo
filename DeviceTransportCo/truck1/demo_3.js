// Chat application between trucks

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

// Require readline for input from the console
const readline = require('readline');

// Require AWS IoT Device SDK
const awsIoT = require('aws-iot-device-sdk');

// Load the endpoint from file
const endpointFile = require('./endpoint.json');

// Fetch the deviceName from the current folder name
const deviceName = __dirname.split('/').pop();

// Set the destinationDeviceName depending on this deviceName
var destinationDeviceName = 'truck1';
if (deviceName === 'truck1') {
    destinationDeviceName = 'truck2';
}

// Build constants
const subTopic = 'truck/messaging/' + deviceName;
const pubTopic = 'truck/messaging/' + destinationDeviceName;
const keyPath = 'private.pem.key';
const certPath = 'certificate.pem.crt';
const caPath = 'root-CA.crt';
const clientId = deviceName;
const host = endpointFile.endpointAddress;

// Interface for console input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Recursive function reading console input
function readConsoleInput() {
    rl.question('Enter a message on the next line to send to ' + pubTopic + ':\r\n', function (message) {
        
        // Calling function to publish to IoT Topic
        publishToIoTTopic(pubTopic, message);
        
        readConsoleInput();
    });
}


// Use the awsIoT library to create device object using the constants created before
const device = awsIoT.device({
   keyPath: keyPath,
  certPath: certPath,
    caPath: caPath,
  clientId: clientId,
      host: host
});


// When the connection to AWS IoT is established, 
// subscribe to the subTopic IoT Topic 
// and start reading from the console for a message 
// to send using the readConsoleInput() function.
device.on('connect', function() {
    // Subscribe to subscriptionTopic
    device.subscribe(subTopic);
    
    // Start reading from the console
    readConsoleInput();
});


// When a new message is received on the subscribed topic, output its  content in the console.
device.on('message', function(topic, message) {
    console.log("Message received on topic " + topic + ": " + message);
});


// Function to publish payload to IoT topic
function publishToIoTTopic(topic, payload) {
    // Publish to specified IoT topic using device object that you created
    device.publish(topic, payload);
}