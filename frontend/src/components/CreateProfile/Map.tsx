import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';


const Map = () => {
  const [position, setPosition] = useState<[number, number] | null>(null); // รอการโหลดตำแหน่ง
  const [error, setError] = useState<string | null>(null);

  // ใช้ Geolocation API เพื่อดึงตำแหน่งของผู้ใช้
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]); // ตั้งค่าตำแหน่งผู้ใช้
          console.log(position.coords);
        },
        (err) => {
          setError('Unable to retrieve your location.');
          // ถ้าไม่สามารถดึงตำแหน่งได้, ใช้กรุงเทพฯ เป็นตำแหน่งเริ่มต้น
          setPosition([13.736717, 100.523186]);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setPosition([13.736717, 100.523186]); // ถ้าไม่รองรับ Geolocation, ใช้กรุงเทพฯ
    }
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]); // อัปเดตตำแหน่งเมื่อคลิก
        console.log(`New position: ${e.latlng.lat}, ${e.latlng.lng}`);
      },
    });
    return <Marker position={position || [13.736717, 100.523186]} />; // ใช้ตำแหน่งจาก state หรือกรุงเทพฯ
  };

  // รอให้ตำแหน่งผู้ใช้โหลดก่อน
  if (!position) {
    return <div>Loading...</div>;
  }

  return (
    <div className='h-full'>
      {error && <div>{error}</div>}
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default Map;
