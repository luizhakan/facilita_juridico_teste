// Mapa.jsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// eslint-disable-next-line react/prop-types
const Mapa = ({ rota }) => {
  // eslint-disable-next-line react/prop-types
  const posicoes = rota.map(cliente => [cliente.coordenada_x, cliente.coordenada_y]);

  useEffect(() => {
    console.log('rota', rota);
    console.log('posicoes', posicoes);
  }, [rota]);

  return (
    <MapContainer center={[-13.0072, -53.1897]} zoom={4} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {posicoes.map((posicao, index) => (
        <Marker key={index} position={posicao}></Marker>
      ))}
      <Polyline positions={posicoes}></Polyline>
    </MapContainer>
  );
};

export default Mapa;
