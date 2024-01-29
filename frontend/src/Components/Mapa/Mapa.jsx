import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import redIconUrl from "../../icon/redicon1.png";
import L from "leaflet";

// eslint-disable-next-line react/prop-types
const Mapa = ({ rota }) => {
  // As coordenadas do ponto inicial, como você forneceu na imagem.
  const pontoInicial = [-8.0584933, -34.8848193];

  // eslint-disable-next-line react/prop-types
  const posicoes = rota.map((cliente) => [
    cliente.coordenada_x,
    cliente.coordenada_y,
  ]);

  // Crie um ícone personalizado
  const redIcon = new L.Icon({
    iconUrl: redIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={[-13.0072, -53.1897]}
      zoom={4}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {posicoes.map((posicao, index) => {
        // Checar se a posição atual é igual ao ponto inicial para aplicar o ícone vermelho
        if (posicao[0] === pontoInicial[0] && posicao[1] === pontoInicial[1]) {
          return (
            <Marker key={index} position={posicao} icon={redIcon}></Marker>
          );
        }
        return <Marker key={index} position={posicao}></Marker>;
      })}
      <Polyline positions={posicoes}></Polyline>
    </MapContainer>
  );
};

export default Mapa;
