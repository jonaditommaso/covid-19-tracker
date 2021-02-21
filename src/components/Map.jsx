import React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import '../styles/map.css';
import { showDataOnMap } from '../utils/common';


const Map = ({ countries, center, zoom, typeData }) => {
  return ( 
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, typeData)}
      </LeafletMap>
    </div>
  );
}
 
export default Map;