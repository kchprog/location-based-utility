
// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Button,
} from 'react-native';

//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';
import { LinearGradient } from 'expo-linear-gradient';


const App = () => {
  const [
    currentLongitude,
    setCurrentLongitude
  ] = useState('...');
  const [
    currentLatitude,
    setCurrentLatitude
  ] = useState('...');
  const [
    locationStatus,
    setLocationStatus
  ] = useState('');
  const [
    timeStatus,
    setTimeStatus
  ] = useState('Loading...');
  const [
    gradientColorA,
    setColorA
  ] = useState('...')
  const [
    gradientColorB,
    setColorB
  ] = useState('...')

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
        getTime();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('Location Found');

        //getting the Longitude from the location json
        const currentLongitude = 
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);
        
        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change
        
        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  const getTime = () => {
    var date = new Date().getDate(); //To get the Current Date
    var month = new Date().getMonth() + 1; //To get the Current Month
    var year = new Date().getFullYear(); //To get the Current Year
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current Minutes
    var sec = new Date().getSeconds(); //To get the Current Seconds

    var hrstr = hours.toString();
    var minstr = min.toString();
    var secstr = sec.toString();

    if (hrstr < 10) {
      hrstr = '0' + hrstr;
    }

    if (minstr < 10) {
      minstr = '0' + minstr;
    }

    if (secstr < 10) {
      secstr = '0' + secstr;
    }

    setTimeStatus(year + "/" + month + "/" + date + " || " + hours + ":" + min + ":" + sec);
    setColorA('blue');
    setColorB('orange');
  }


  var interval = setInterval(getTime, 1000);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
      <LinearGradient 
      colors={[gradientColorA, gradientColorB]} 
      start={{
        x: 0,
        y: 0
      }}
      end={{
        x: 1,
        y: 1
      }}
      style={styles.box} />
        <View style={styles.container}>
          <Text style ={{
              marginBottom: 10,
            }}>
            
            Your Local Time: {timeStatus}
          </Text>
          <Image
            source={{
              uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/location.png',
            }}
            style={{width: 100, height: 100}}
          />
          <Text style={styles.boldText}>
            {locationStatus}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Longitude: {currentLongitude}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Latitude: {currentLatitude}
          </Text>
          <View style={{marginTop: 20}}>
            <Button
              title="Button"
              onPress={getOneTimeLocation}
            />
          </View>
        </View>
      </View>
      
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: '100%',
    height: 200,
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
  },
});

export default App;