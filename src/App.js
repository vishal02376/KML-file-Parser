
import SummaryTable from "./SummaryTable";
import DetailedInfo from "./DetailedInfo";
import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./global.css"; // Import global styles

const App = () => {
  const [kmlData, setKmlData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (file) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const kmlText = e.target.result;
      const parsedData = parseKML(kmlText);
      setKmlData(parsedData);
      generateSummary(parsedData);
      generateDetails(parsedData);
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const parseKML = (kmlText) => {
    // Parse KML file and convert it to GeoJSON format
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, "text/xml");
    const placemarks = Array.from(kmlDoc.getElementsByTagName("Placemark"));

    const features = placemarks.map((placemark) => {
      const name = placemark.getElementsByTagName("name")[0]?.textContent || "Unnamed";
      const coordinates = extractCoordinates(placemark);
      return {
        type: "Feature",
        properties: { name },
        geometry: {
          type: "Point", // Default to Point, update based on KML geometry
          coordinates,
        },
      };
    });

    return {
      type: "FeatureCollection",
      features,
    };
  };

  const extractCoordinates = (placemark) => {
    const point = placemark.getElementsByTagName("Point")[0];
    const lineString = placemark.getElementsByTagName("LineString")[0];
    const polygon = placemark.getElementsByTagName("Polygon")[0];

    if (point) {
      const coords = point.getElementsByTagName("coordinates")[0]?.textContent.trim();
      return coords.split(",").map(Number);
    } else if (lineString) {
      const coords = lineString.getElementsByTagName("coordinates")[0]?.textContent.trim();
      return coords.split(" ").map((pair) => pair.split(",").map(Number));
    } else if (polygon) {
      const coords = polygon.getElementsByTagName("coordinates")[0]?.textContent.trim();
      return coords.split(" ").map((pair) => pair.split(",").map(Number));
    }
    return [0, 0]; // Default coordinates
  };

  const generateSummary = (data) => {
    const elementCounts = {};
    data.features.forEach((feature) => {
      const type = feature.geometry.type;
      elementCounts[type] = (elementCounts[type] || 0) + 1;
    });
    setSummary(elementCounts);
  };

  const generateDetails = (data) => {
    const details = data.features.map((feature) => {
      const type = feature.geometry.type;
      let length = 0;
      if (type === "LineString" || type === "MultiLineString") {
        length = calculateLength(feature.geometry.coordinates);
      }
      return { type, length };
    });
    setDetails(details);
  };

  const calculateLength = (coordinates) => {
    // Calculate the length of lines (placeholder implementation)
    return coordinates.length;
  };

  return (
    <div className="container">
      <h1>KML File Parser</h1>
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload KML File
      </label>
      <input id="file-upload" type="file" accept=".kml" onChange={(e) => handleFileUpload(e.target.files[0])} />

      {isLoading && <div className="loading-spinner"></div>}

      {kmlData && (
        <div>
          <div className="map-container">
            <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <GeoJSON data={kmlData} />
            </MapContainer>
          </div>

          <h2>Summary</h2>
          <SummaryTable summary={summary} />

          <h2>Detailed Information</h2>
          <DetailedInfo details={details} />
        </div>
      )}
    </div>
  );
};

export default App;
