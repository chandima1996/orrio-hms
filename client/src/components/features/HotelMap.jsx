import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet Icon Fix (React වලදී icon එක load නොවෙන ප්‍රශ්නය විසඳීම)
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const HotelMap = ({ location = "Sri Lanka" }) => {
  // දැනට අපි Default Coordinates (Colombo) දාමු. 
  // පස්සේ Database එකට Lat/Lng එකතු කළාම ඒක මෙතනට පාස් කරන්න පුළුවන්.
  const position = [6.9271, 79.8612]; 

  return (
    <div className="relative z-0 w-full h-full overflow-hidden rounded-3xl">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {location} <br /> Exact location provided after booking.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default HotelMap;