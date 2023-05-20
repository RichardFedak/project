### Code Explanation
This code is designed to work seamlessly with a multifunctional shield on Arduino UNO.  
The Arduino UNO code consists of the following key components and it can be easily :

1. **Animation Data** - The code includes an array `ANIMATION` that represents the animation frames for displaying an alert on the 7-segment display. Each frame is represented by a set of values corresponding to the segments of the display.

2. **Display and Buttons** - The code includes functions `displaySegment`, `checkForButtons`, and `display` to control the 7-segment display and handle button inputs for switching views and animations.

   - The `displaySegment` function is responsible for displaying a specific segment on the 7-segment display. It takes the segment value and the position of the segment as parameters.
  
   - The `checkForButtons` function checks the state of the buttons. If any button is pressed, the corresponding element in the `buttonsState` array is set to `true`.
   
   - The `display` function is the main logic for displaying temperature, humidity, or animations on the 7-segment display. It checks the current state and determines whether to display sensor data or animation frames based on the button inputs and the `isAlert` flag.

3. **Animation Logic** - The code includes functions `showAnimation` and `updateAnimation` to display and update the animation frames on the 7-segment display.

   - The `showAnimation` function iterates through each segment and displays the values in the `ANIMATION` array, representing the current animation frame.
   
   - The `updateAnimation` function updates the `animationFrame` variable to advance the animation frames. It keeps track of the direction of the animation (`goingRight`) and adjusts the frame index accordingly.

4. **DHT11 Sensor** - The code utilizes the `dht` library to read data from the DHT11 sensor connected to pin `DHT11_PIN`. The `getSensorData` function reads the sensor data using the `DHT.read11` method and updates the `sensor_data` array with the temperature and humidity values.

5. **Setup and Loop** - The `setup` function is called once during the initialization phase. It sets up the serial communication and configures the button pins and display pins.

   - The `loop` function is the main program loop that continuously runs after the setup phase. It checks for button inputs using the `checkForButtons` function, displays data or animations using the `display` function.