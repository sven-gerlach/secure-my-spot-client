import { useRef, useEffect } from "react";


const GoogleMap = () => {
  const googleMapRef = useRef();
  let googleMap;
  useEffect(() => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`;
    googleMapScript.async = true;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener('load', () => {
      createGoogleMap()
    })
  }, []);

  const createGoogleMap = () => {
    googleMap = new window.google.maps.Map(googleMapRef.current, {
      zoom: 16,
      center: {
        lat: 40.760551,
        lng: -73.997561,
      }
    });
  };

  return (
    <div
      id="google-map"
      ref={googleMapRef}
      style={{ width: "400px", height: "300px" }}
    />
  );
};

export default GoogleMap
