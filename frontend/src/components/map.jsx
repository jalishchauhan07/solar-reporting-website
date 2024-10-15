import { Mappls } from "mappls-web-maps";

export default function Map({ location }) {
  const currentLocation = location.split(" ").map(parseFloat);
  const mapProperty = {
    center: [currentLocation[0], currentLocation[1]],
    zoom: 10,
    zoomControl: true,
    geolocation: false,
    traffic: false,
    clickableIcons: false,
  };
  let mapObj, marker;
  const mapplsObj = new Mappls();
  mapplsObj.initialize("0423f70c5db0b9ee4ba3fb09792726ff", () => {
    mapObj = new mapplsObj.Map({ id: "map", properties: mapProperty });
    marker = new mapplsObj.Marker({
      map: mapObj,
      position: { lat: currentLocation[0], lng: currentLocation[1] },
    });
  });
  return (
    <div
      id="map"
      style={{
        display: "flex",
        width: "100%",
        height: "400px",
        justifyContent: "center",
        alignItems: "center",
      }}
    ></div>
  );
}
