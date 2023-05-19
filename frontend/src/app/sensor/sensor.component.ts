import { Component, Input, OnInit, ElementRef, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Device } from '../app.component';
import { Observable, timer, Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {
  @Input() device!: Device;
  chartTemperature: any = [];
  chartHumidity: any = [];
  sub!: Subscription;
  updateTimer: Observable<number> = timer(0, 5000);

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['device'] && !changes['device'].firstChange) {
      this.updateCharts();
    }
  }

  ngOnInit() {
    this.createCharts();
    this.sub = this.updateTimer.subscribe(() => {
      forkJoin([
        this.device.updateTemperatureData(),
        this.device.updateHumidityData()
      ]).subscribe(([temperatureData, humidityData]) => {
        this.device.temperatureData = temperatureData;
        this.device.humidityData = humidityData;
        this.updateCharts();
      })
    });
  }

  private createCharts() {
    this.createChartTemperature();
    this.createChartHumidity();

  }
  private createChartTemperature() {
    let htmlRef = this.elementRef.nativeElement.querySelector(`#chartTemperature`);
    this.chartTemperature = new Chart(htmlRef, {
      type: 'bar',
      data: {
        labels: this.device.temperatureData.map(data => new Date(data.datetime).toLocaleTimeString()),
        datasets: [
          {
            label: 'Temperature',
            data: this.device.temperatureData.map(data => data.value),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },

        },
      },
    });
  }

  private createChartHumidity() {
    let htmlRef = this.elementRef.nativeElement.querySelector(`#chartHumidity`);
    this.chartHumidity = new Chart(htmlRef, {
      type: 'bar',
      data: {
        labels: this.device.humidityData.map(data => new Date(data.datetime).toLocaleTimeString()),
        datasets: [
          {
            label: 'Humidity',
            data: this.device.humidityData.map(data => data.value),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },

        },
      },
    });
  }

  private updateCharts() {
    this.chartTemperature.data.labels = this.device.temperatureData.map(data => new Date(data.datetime).toLocaleTimeString());
    this.chartTemperature.data.datasets[0].data = this.device.temperatureData.map(data => data.value);
    this.chartHumidity.data.labels = this.device.humidityData.map(data => new Date(data.datetime).toLocaleTimeString());
    this.chartHumidity.data.datasets[0].data = this.device.humidityData.map(data => data.value);
    this.chartHumidity.update();
    this.chartTemperature.update();
  }
}
