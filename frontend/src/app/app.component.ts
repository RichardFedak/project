import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Device {
  id: number;
  name: string;
  temperatureData: { value: number; datetime: string }[];
  humidityData: { value: number; datetime: string }[];
  updateTemperatureData: () => Observable<{ value: number; datetime: string }[]>;
  updateHumidityData: () => Observable<{ value: number; datetime: string }[]>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  devices: Device[] = [];
  selectedDevice!: Device;

  constructor(private http: HttpClient) {
    this.fetchDevices();
  }

  fetchDevices() {
    this.http.get<Device[]>('http://localhost:3001/api/devices').subscribe({
      next:(devices: Device[]) => {
        this.devices = devices;
        this.devices.map(d => d.updateTemperatureData = this.fetchDeviceData.bind(this, d.id, "temperatureData"));
        this.devices.map(d => d.updateHumidityData = this.fetchDeviceData.bind(this, d.id, "humidityData"));
      },
      error:(error) => {
        console.error('Error fetching devices:', error);
      }
    });
  }

  selectDevice(device: Device) {
    this.fetchDeviceData(device.id, "temperatureData").subscribe(data => device.temperatureData = data);
    this.fetchDeviceData(device.id, "humidityData").subscribe(data => device.humidityData = data);
    this.selectedDevice = device;
  }

  fetchDeviceData(deviceID: number, dataType: string): Observable<{ value: number; datetime: string }[]> {
    return this.http.get<{ value: number; datetime: string }[]>(
        `http://localhost:3001/api/devices/${deviceID}/${dataType}`
      );
  }
}
