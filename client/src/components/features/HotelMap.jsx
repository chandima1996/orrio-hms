import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Props වලින් lat, lng ගන්නවා
const HotelMap = ({ location, lat, lng }) => {
  
  // Default Colombo if data missing
  const position = [lat || 6.9271, lng || 79.8612]; 

  return (
    <div className="relative z-0 w-full h-full overflow-hidden rounded-3xl">
      <MapContainer key={`${lat}-${lng}`} center={position} zoom={15} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {location} <br /> Selected Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default HotelMap;