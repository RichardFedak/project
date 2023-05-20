# Server

The `server.js` file contains the server-side code. It is responsible for receiving data from Azure Service Bus, storing the data in JSON files, detecting elevated measured values and providing endpoints for frontend to retrieve the data.

## Prerequisites

Before running the server, make sure you have the following dependencies installed:

- **@azure/service-bus**: Install this library using the command `npm install @azure/service-bus`.
- **express**: Install this library using the command `npm install express`.
- **cors**: Install this library using the command `npm install cors`.

Additionally, ensure that you have a valid connection string and subscription name for your Azure Service Bus instance configured in the `config.js` file.

## Core Functions

### addNewDevice(deviceData, dataType)

This function adds a new device to the `devices` array. It extracts the device ID, device name, data value, and timestamp from the message and creates a new device object in the `devices` array.

### deviceExists(deviceID)

This function checks if a device with the given `deviceID` already exists in the `devices` array.

### deviceDataExists(device, dataType)

This function checks if the specified `dataType` (temperature or humidity (or other...)) exists for a given device.

### messageHandler(messageReceived, dataType)

This function handles the processing of incoming messages from Azure Service Bus. It checks if a device with the corresponding `deviceID` already exists. If the device exists, it adds the new data value and timestamp to the device's data array. If the device doesn't exist, it creates a new device entry with the received data.

### temperatureMessageHandler(messageReceived) & humidityMessageHandler(messageReceived)

These asynchronous functions are the message handlers for the topics. It invokes the `messageHandler` function to process the received message.

### myErrorHandler(error)

This asynchronous function handles any errors that occur during message processing or publishing. It logs the error to the console for debugging purposes.

### saveDeviceData(device)

This function saves the data of a specific device to a JSON file. It creates a folder for the device (if it doesn't exist) and writes the device data to a file with a timestamp.


### checkHighTemperatureOnDevice1()
*This function is only for demonstration and can me modified for your needs.*  
This function checks the average temperature value for the first device in the `devices` array. If the average temperature exceeds 50, an alert message is sent to the "arduinoalert" topic (OPTIONAL - also to the "alert" topic). You can uncomment the appropriate lines to send an email alert. 

### publish(message, topicName)

This function publishes the provided `message` to the specified `topicName` using the Azure Service Bus client. It creates a message batch, adds the message to the batch, and sends it to the topic.

## Endpoints

### /api/devices

This endpoint returns the list of devices available in the `devices` array as a JSON response.

### /api/devices/:id/:dataType

This endpoint returns the data of a specific device and data type. It accepts parameters `id` (device ID) and `dataType` (temperature or humidity (or other...)). It retrieves the corresponding device from the `devices` array and returns the requested data as a JSON response. Only the last 10 data points are returned.