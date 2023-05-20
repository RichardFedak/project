const { ServiceBusClient } = require("@azure/service-bus");
const { SerialPort } = require('serialport');
const { connectionString } = require("../config");

const port = new SerialPort({ path: 'COM4', baudRate: 9600 })

const sbClient = new ServiceBusClient(connectionString);

const deviceID = 1;
const deviceName = "Device1"
const alertReceiver = sbClient.createReceiver("arduinoAlert", deviceName);

const alertHandler = async (msg) => {
	port.write('ALERT\n');
};

const myErrorHandler = async (error) => {
	console.log(error);
};

alertReceiver.subscribe({
	processMessage: alertHandler,
	processError: myErrorHandler
});

async function publish(message, topicName) {
    const sender = sbClient.createSender(topicName);

    // create a batch object
    let batch = await sender.createMessageBatch();

    batch.tryAddMessage(message);

    await sender.sendMessages(batch);

    await sender.close();
}

function generateMessageObject(value, dateTime) {
    return {
        body: {
            deviceID: deviceID,
            deviceName: deviceName,
            value: value,
            dateTime: dateTime,
        }
    };
}

function publishData(temperature, humidity) {
    let currTime = new Date();

    const messageT = generateMessageObject(temperature, currTime);
    const messageH = generateMessageObject(humidity, currTime);

    publish(messageT, "temperature");
    publish(messageH, "humidity");
}

// COMMUNICATION WITH ARDUINO
port.on('data', data => {

    const [temperature, humidity] = data.toString().split(',').map(parseFloat);

    // Do something with the parsed values
    console.log('Temperature:', temperature);
    console.log('Humidity:', humidity);

    publishData(temperature, humidity);

});