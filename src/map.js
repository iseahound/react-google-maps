import {useState, useMemo, useCallback, useRef, useEffect} from 'react';
import {
    GoogleMap,
    Marker,
    DirectionsRenderer,
    Circle,
    MarkerClusterer,
    useGoogleMap,
} from '@react-google-maps/api';
import Places from './places';
//import Distance from './distance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pin from './pin.png';
import Button from 'react-bootstrap/Button';

export default function Map() {

    const google = window.google;
    const center = {lat: 40.7128, lng: -74.0060};
    const mapRef = useRef();
    const onLoad = useCallback((map) => (mapRef.current = map), []);
    const options = useMemo(
        () => ({
          //mapId: "b181cac70f27f5e6",
          //disableDefaultUI: true,
          //clickableIcons: false,
        }),
        []
      );
    const [office, setOffice] = useState();
    const [directions, setDirections] = useState();
    const houses = useMemo(() => generateHouses(center), [center]);

    // If browser supports navigator.geolocation, generate Lat/Long else let user know there is an error
    const posError = () => {
        if (navigator.permissions) {
            navigator.permissions.query({
                name: 'geolocation'
            }).then(res => {
                if (res.state === 'denied') {
                    alert('Enable location permissions for this website in your browser settings.')
                }
            })
        } else {
            alert('Unable to access your location. You can continue by submitting location manually.') // Obtaining Lat/long from address necessary
        }
    }

    const fetchDirections = (house: LatLngLiteral) => {
        if (!office) return;
    
        const service = new google.maps.DirectionsService();
        service.route(
          {
            origin: house,
            destination: office,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result) {
              setDirections(result);
            }
          }
        );
      };
    
    return (
        <div className="container">
            <div className="controls">
                <h1>Search for stores nearby</h1>
                <Button onClick={() => {
                    navigator.geolocation.getCurrentPosition((position) => {
                        
                        toast("Your current position is: " + position.coords.latitude + ", " + position.coords.longitude);
                        center.lat = position.coords.latitude;
                        center.lng = position.coords.longitude;
                        //setOffice({lat: position.coords.latitude, lng: position.coords.longitude});
                        mapRef.current?.panTo(center);
                        mapRef.current?.setZoom(15);
                    }, posError);
                }}>
                    Get my current position!
                </Button>
                <Places
                    setOffice={(position) => {
                        setOffice(position);
                        mapRef.current?.panTo(position);
                    }}
                />
            </div>
            <div className="map">
                <GoogleMap zoom={10} center={center} mapContainerClassName="map-container" options={options} onLoad={onLoad}>
                    {office && (
                    <>
                    <Marker
                        position={office}
                        icon={pin}
                    />

                    <MarkerClusterer>
                        {(clusterer) =>
                        houses.map((house) => (
                            <Marker
                            key={house.lat}
                            position={house}
                            clusterer={clusterer}
                            onClick={() => {
                                fetchDirections(house);
                            }}
                            />
                        ))
                        }
                    </MarkerClusterer>

                    <Circle center={office} radius={1000} options={closeOptions} />
                    </>
                    )}
                </GoogleMap>
            </div>
        </div>
    );
}

const generateHouses = (position) => {
    const _houses = [];
    for (let i = 0; i < 100; i++) {
      const direction = Math.random() < 0.5 ? -2 : 2;
      _houses.push({
        lat: position.lat + Math.random() / direction,
        lng: position.lng + Math.random() / direction,
      });
    }
    return _houses;
  };
  
const defaultOptions = {
    strokeOpacity: 0.5,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
};
const closeOptions = {
    ...defaultOptions,
    zIndex: 3,
    fillOpacity: 0.05,
    strokeColor: "#8BC34A",
    fillColor: "#8BC34A",
};