# GeoLocation in JavaScript

- navigator.geolocation.getCurrentPosition()

- the getCurrentPosition returns the current location of the device.

- the watchPosition is a handler function that is automatically invoked when the device's location changes.

- There are three possible arguments with these methods.

## getCurrentPosition

- You can use the getCurrentPosition method to get the user's current location. It sends an asynchronous requrest to the browser, asking for consent to share their location.

``` TS

const successCallback = (position) => {
    console.log(position);
}

const errorCallback = (error) => {
    console.log(error);
}


navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

```

- Always run tsc --init to initialize a typescript configuration for your project.

- The result from your success callback will return an array of two things

- The first being GeolocationPosition.coords object, this represents the position, altitude and the accuracy at which the device calculates these properties.

- The timestamp: represents the time at which the location was gotten.


## How to Track User Location with watchPosition

- The watchPosition() method allows the app to continually track the user, and get updated as their position changes.  It does this by installing a handler function that will be called automatically whenever the user's device position changes.

``` TS

const id = navigator.geolocation.watchPosition(successCallback, errorCallback);

```

## How to Stop Tracking Position with clearWatch()

- We use the clearWatch() method to cancel the handler functions that were previously installed using the watchPosition.

``` TS

navigator.geolocation.clearWatch(id);


```


## How to Use the options Object
.
- Although the options object is optional, it provides parameters that can help you get more accurate results

``` TS

const options = {
    enableHighAccuracy: true,
    timeout: 10000
};

navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback,
    options
)