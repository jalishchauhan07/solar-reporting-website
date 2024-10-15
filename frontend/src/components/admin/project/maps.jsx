/* eslint-disable react/prop-types */
import { mappls } from "mappls-web-maps";
import { useEffect, useState } from "react";

export default function Map({ position }) {
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    if (position) {
      setCoordinates(position);
    }
  }, [position]);

  const location_ = coordinates ? coordinates.split(" ").map(Number) : [0, 0];

  const mapProperty = {
    center: { lat: location_[0], lng: location_[1] },
    zoom: 10,
    zoomControl: true,
    geolocation: false,
    traffic: false,
    clickableIcons: false,
  };

  let mapObj, marker;
  const mapplsObj = new mappls();

  mapplsObj.initialize("0423f70c5db0b9ee4ba3fb09792726ff", () => {
    mapObj = new mapplsObj.Map({ id: "map", properties: mapProperty });

    mapObj.addListener("click", function (e) {
      localStorage.setItem("location", e.lngLat.lat + " " + e.lngLat.lng);
      if (marker) {
        marker.setPosition({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      } else {
        marker = new mapplsObj.Marker({
          map: mapObj,
          position: { lat: e.lngLat.lat, lng: e.lngLat.lng },
        });
      }
    });
  });

  return (
    <div
      id="map"
      style={{
        width: "60%",
        height: "80%",
        margin: "auto",
      }}
    ></div>
  );
}
