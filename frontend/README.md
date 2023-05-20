## Prerequisites

Before using the Angular frontend code, make sure you have Angular installed globally on your machine. You can install it using the following command:
```
npm install -g @angular/cli
```

Install all the dependencies specified in `package.json`:
```
npm install
```

## Core Components

### AppComponent

The `AppComponent`, located in `/src/app/app.component.ts` is the main component of the application. It interacts with the backend server to fetch and display device data.

#### Properties

- `devices: Device[]`: An array of `Device` objects representing the devices retrieved from the server.
- `selectedDevice: Device`: The currently selected device.

#### Methods

- `constructor(private http: HttpClient)`: Initializes the `AppComponent` and fetches the list of devices from the server.
- `fetchDevices()`: Fetches the list of devices from the server and maps the update functions for temperature and humidity data.
- `selectDevice(device: Device)`: Selects a device and fetches its temperature and humidity data from the server.
- `fetchDeviceData(deviceID: number, dataType: string)`: Fetches the device data (temperature or humidity (or other...)) for a specific device from the server.

### SensorComponent

The `SensorComponent`, located in `/src/app/sensor/sensor.component.ts` is a child component responsible for displaying the charts for temperature and humidity data of a specific device.

### Properties

- `@Input() device: Device`: The device object for which the charts are displayed.
- `chartTemperature: any`: The chart object for temperature data.
- `chartHumidity: any`: The chart object for humidity data.
- `sub: Subscription`: The subscription object to track the timer for data updates.
- `updateTimer: Observable<number>`: A timer that triggers data updates. Updates data every 5 seconds.

### Lifecycle Hooks

- `ngOnInit()`: Initializes the component and sets up the timer for periodically receive data from server and updating charts.
- `ngOnChanges(changes: SimpleChanges)`: Responds to changes in the input properties, specifically when the `device` object changes. (e.g. when a new device is selected)

### Methods

- `createCharts()`: Creates the chart objects for temperature and humidity data.
- `createChartTemperature()` & `createChartHumidity()`: Creates charts for temperature and humidity data using the Chart.js library.
- `updateCharts()`: Updates the chart data based on the device's temperature and humidity data.

