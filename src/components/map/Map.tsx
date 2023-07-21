import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import classes from "./Map.module.css";
import { AppConfig } from "../../config";
import PositionGroupLayers from "./PositionGroupLayers";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Map = () => {
    const center = useSelector((state: RootState) => state.map.center);

    return (
        <div className="col">
            <div className={`row ${classes.map}`}>
                <MapContainer
                    attributionControl={true}
                    zoom={AppConfig.DefaultZoomLevel}
                    center={center}
                >
                    <LayersControl>
                        <LayersControl.BaseLayer name="OpenStreetMap">
                            <TileLayer
                                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                maxZoom={AppConfig.MaxZoomLevel}
                                attribution="© OpenStreetMap"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer checked name="MapboxStreets">
                            <TileLayer
                                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                                accessToken="pk.eyJ1IjoiZ21pbGxzIiwiYSI6ImNsMDQweXYzNTBkMXkzcXBkaXFwZW5wYXgifQ.YzuUFNKB7DwY9G9bQ4oVmg"
                                maxZoom={AppConfig.MaxZoomLevel}
                                tileSize={512}
                                zoomOffset={-1}
                                attribution="© Mapbox"
                                id="mapbox/streets-v11"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="EsriWorldImagery">
                            <TileLayer
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                maxZoom={AppConfig.MaxZoomLevel}
                                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <PositionGroupLayers />
                </MapContainer>
            </div>
        </div>
    );
};

export default Map;
