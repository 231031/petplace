// src/pages/FullMapPage.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js'; // นำเข้า Geocoder control

const FullMap = () => {
    const [position, setPosition] = useState<[number, number] | null>(null); // รอการโหลดตำแหน่ง
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ดึงตำแหน่งของผู้ใช้
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]); // ตั้งค่าตำแหน่งผู้ใช้
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

    // ฟังก์ชันสำหรับการค้นหาสถานที่
    const MapWithGeocoder = () => {
        const map = useMap(); // ใช้ map instance
        useEffect(() => {
            const geocoder = L.Control.geocoder().addTo(map); // เพิ่ม Geocoder คอนโทรลบนแผนที่
            return () => {
                map.removeControl(geocoder); // ลบเมื่อคอมโพเนนต์ถูกทำลาย
            };
        }, [map]);

        return null; // ไม่มี UI เพิ่มเติม
    };

    // ฟังก์ชันสำหรับ Marker ที่ตำแหน่งปัจจุบัน
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
              setPosition([e.latlng.lat, e.latlng.lng]); // อัปเดตตำแหน่งเมื่อคลิก
              console.log(`New position: ${e.latlng.lat}, ${e.latlng.lng}`);
            },
          });
        return (
            <Marker position={position || [13.736717, 100.523186]}>
                <Popup>Current Location</Popup>
            </Marker>
        );
    };

    // รอให้ตำแหน่งผู้ใช้โหลดก่อน
    if (!position) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-screen">
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />

                {/* เพิ่ม Geocoder สำหรับค้นหาตำแหน่ง */}
                <MapWithGeocoder />
            </MapContainer>
        </div>
    );
};

export default FullMap;
