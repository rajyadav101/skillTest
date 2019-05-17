import React from 'react';
import {
  MapView,
  Alert
} from 'react-native';
import {
    Container, 
    Content,
    Item, 
    Input, 
    Text,
    Button,
    Toast 
   } from 'native-base';
import config from './../../config';
import MapViewDirections from 'react-native-maps-directions';

const key = config.GEOCODE_API_KEY;
export default class Login extends React.Component {
    state = {
        source:null,
        destination:null,
        sourceLatLong:null,
        destinationLatLong:null,
        route:false,

    }
    // getting Geocode for source and destination
    getGeocode = async() =>{
        if(this.validateInput()){
            let sourceFormatedAddress = this.fotmatAddress(this.state.source);
            let destinationFormateAddress = this.fotmatAddress(this.state.destination);
            var v = this;
            const API_URL_SRC = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ sourceFormatedAddress + '&key=' + config.GEOCODE_API_KEY;
            const API_URL_DEST = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ sourceFormatedAddress + '&key=' + config.GEOCODE_API_KEY;
            fetch(API_URL_SRC)
              .then((response) => response.json())
              .then((responseJson) => {
              // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
              var location = responseJson.results[0].geometry.location;
              this.setState({
                sourceLatLong:location
              });
              })
              .then(function(){
                fetch(API_URL_DEST)
                .then((response) => response.json())
                .then((responseJson) => {
                // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
                var sourceLatLong = responseJson.results[0].geometry.location;
                v.setState({
                  destinationLatLong: sourceLatLong,
                  route:true
                });
                })
              })


        }
    }
    // Validate input not null
    validateInput = () => {
        let status = true
        if(this.state.source == null){
            status = false;
            Alert.alert(
                'Alert Title',
                'Please Enter Source',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
            return status;
        }
        if(this.state.destination == null){
            status = false;
            Alert.alert(
                'Alert Title',
                'Please Enter destination',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              );
            return status;
        }
        return status;
    }

    // Formating the input adress to get geocordinate of location.
    fotmatAddress =(rawAddress) =>{
        var address = rawAddress.split(' ').join('+');
        return address;
    }
    render(){
        const {route} = this.state;
        console.log('ss',this.state.sourceLatLong);
        console.log('ll',this.state.destinationLatLong);
        if(route == true){
        let origin = this.state.sourceLatLong;
        let destination = this.state.destinationLatLong;
         return(
            <MapView>
            <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={key}
            />
            </MapView>
         );   
        }
        else{
            return(
                <Container style={{padding:10}}>
                <Content>
                <Item>
                      {/* <Icon active name='mail' style={styles.greyIconColor}/> */}
                      <Input onChangeText={(source) => this.setState({ source: source })}
                              placeholder='Enter Source' placeholderTextColor='#bbbbbb'/>
                </Item>
                <Item>
                {/* <Icon active name='mail' style={styles.greyIconColor}/> */}
                <Input onChangeText={(destination) => this.setState({ destination: destination })}
                        placeholder='Enter destination' placeholderTextColor='#bbbbbb'/>
                </Item>
                <Button primary style={{width:'100%', marginTop:10}} onPress={this.getGeocode}>
                <Text style={{textAlign:'center', width:'100%'}}> Find Route </Text>
                </Button>
    
    
                
                </Content>
                </Container>
            );
        }
        
    }
}