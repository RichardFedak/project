const { delay, ServiceBusClient } = require("@azure/service-bus");
const fs = require('fs');
const { connectionString, subscriptionName } = require("../config");
const express = require('express');
const cors = require('cors');

const sbClient = new ServiceBusClient(connectionString);
const temperatureReceiver = sbClient.createReceiver("temperature", subscriptionName);
const humidityReceiver = sbClient.createReceiver("humidity", subscriptionName);

const app = express();
const port = 3001; // Choose a suitable port number

app.use(express.static('public'));
app.use(express.json());

app.use(cors({
	"origin": '*',
}));



const TEMPERATURE = "temperatureData";
const HUMIDITY = "humidityData";

// var devices = []; // Uncomment to use real device/s

// Simulation devices - comment out when you want to use real device/s
const devices = [
	{
		id: 1,
		name: 'Sensor 1',
		temperatureData: generateData(20, 5),
		humidityData: generateData(20, 5),
	},
	{
		id: 2,
		name: 'Sensor 2',
		temperatureData: generateData(20, 5),
		humidityData: generateData(20, 5),
	},
	{
		id: 3,
		name: 'Sensor 3',
		temperatureData: generateData(20, 5),
		humidityData: generateData(20, 5),
	}
];

function generateData(count, step) {
	const data = [];
	let currentValue = 0;

	for (let i = 0; i < count; i++) {
		const datetime = new Date();
		datetime.setMinutes(datetime.getMinutes() + i * step);
		currentValue = getRandomValue(currentValue);
		data.push({ value: currentValue, datetime: datetime });
	}

	return data;
}

function getRandomValue(previousValue) {
	// Generate a random value based on the previous value
	const min = previousValue - 1;
	const max = previousValue + 1;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addNewDevice(deviceData, dataType) {
	devices.push({
		id: deviceData.body.deviceID,
		name: deviceData.body.deviceName,
		[dataType]: [
			{
				value: deviceData.body.value,
				datetime: deviceData.body.dateTime,
			}
		],
	})
}

function deviceExists(deviceID) {
	return devices.some(device => device.id === deviceID);
}

function deviceDataExists(device, dataType) {
	return device[dataType]
}

function messageHandler(messageReceived, dataType) {
	if (devices.length == 0) {
		addNewDevice(messageReceived, dataType);
	}
	else {
		if (deviceExists(messageReceived.body.deviceID)) {
			let device = devices.find(device => device.id == messageReceived.body.deviceID)
			if (deviceDataExists(device, dataType)) {
				device[dataType].push({
					value: messageReceived.body.value,
					datetime: messageReceived.body.dateTime,
				})
			}
			else {
				device[dataType] = [
					{
						value: messageReceived.body.value,
						datetime: messageReceived.body.dateTime,
					}
				]
			}
		}
		else {
			addNewDevice(messageReceived, dataType);
		}
	}
}

const temperatureMessageHandler = async (messageReceived) => {
	messageHandler(messageReceived, TEMPERATURE);
};

const humidityMessageHandler = async (messageReceived) => {
	messageHandler(messageReceived, HUMIDITY);
};

const myErrorHandler = async (error) => {
	console.log(error);
};

temperatureReceiver.subscribe({
	processMessage: temperatureMessageHandler,
	processError: myErrorHandler
});

humidityReceiver.subscribe({
	processMessage: humidityMessageHandler,
	processError: myErrorHandler
});

// Endpoint to fetch the list of devices
app.get('/api/devices', (req, res) => {
	res.json(devices);
});

// Endpoint to fetch data of a specific device
app.get('/api/devices/:id/:dataType', (req, res) => {
	console.log("Get device data: ", req.params.id);
	const deviceID = parseInt(req.params.id);
	let device = devices.find(device => device.id === deviceID);

	if (device) {
		if (device[req.params.dataType]) {
			// device[req.params.dataType] = generateData(20,5); // for simulation only
			let data = [];
			if (device[req.params.dataType].length < 10) data = device[req.params.dataType]
			else data = device[req.params.dataType].slice(-10);
			res.json(data);
		} else {
			res.status(404).json({ error: 'Data type not found' });
		}
	} else {
		res.status(404).json({ error: 'Device not found' });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});


function saveDeviceData(device) {
	const folderName = device.name; // Name the folder after the device
	const folderPath = `../data/${folderName}`; // Assuming the folder is created in the current directory
	const timestamp = new Date().getTime();
	// Create the folder if it doesn't exist
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath);
	}

	const data = JSON.stringify(device, null, 2); // Convert device object to JSON string with 2-space indentation

	fs.writeFile(`${folderPath}/${folderName}${timestamp}.json`, data, (err) => {
		if (err) {
			console.error(`Error writing device data to file for ${device.name}:`, err);
		} else {
			console.log(`${folderName} data saved !`);
		}
	});

	device.temperatureData = device.temperatureData.slice(-10);
}

function saveDevicesData() {
	devices.forEach((device) => {
		saveDeviceData(device);
	});
}

// setInterval(saveDevicesData, 60 * 1000); // TO STORE DATA

async function publish(message, topicName) {
	const sender = sbClient.createSender(topicName);

	// create a batch object
	let batch = await sender.createMessageBatch();

	batch.tryAddMessage(message);

	await sender.sendMessages(batch);

	await sender.close();
}

function calculateAverage(array) {
	const sum = array.reduce((accumulator, curr) => accumulator + curr.value, 0);
	const average = sum / array.length;
	return average;
}

function checkHighTemperatureOnDevice1() {
	if (devices.length > 0) {
		let dev1 = devices[0];
		let avg = calculateAverage(dev1[TEMPERATURE]);
		// avg = avg + 50; // TEST NOTIFICATION
		if (avg > 50) {
			const now = new Date();
			const msg = {
				deviceID: dev1.id,
				deviceName: dev1.name,
				temperature: avg,
				dateTime: now.toLocaleString()
			}

			// publish({body: msg}, "alert"); // TO SEND EMAIL
			publish({ body: msg }, "arduinoalert"); // TO ALERT ARDUINO

			console.log("Sending alert !", avg);
		}
		else console.log("No alert: ", avg);
	}
}

setInterval(checkHighTemperatureOnDevice1, 10 * 1000);