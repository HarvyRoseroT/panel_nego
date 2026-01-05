"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const countryCenters: Record<string, { lat: number; lng: number }> = {
  Colombia: { lat: 4.5709, lng: -74.2973 },
  Ecuador: { lat: -1.8312, lng: -78.1834 },
  Peru: { lat: -9.19, lng: -75.0152 },
  Venezuela: { lat: 6.4238, lng: -66.5897 },
  Chile: { lat: -35.6751, lng: -71.543 },
};


export default function LocationPicker({
  value,
  pais,
  onChange,
}: {
  value: {
    lat: number | null;
    lng: number | null;
  };
  pais: string;
  onChange: (data: {
    lat: number;
    lng: number;
    ciudad: string;
  }) => void;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const center =
    value.lat && value.lng
      ? { lat: value.lat, lng: value.lng }
      : countryCenters[pais] || { lat: 4.5709, lng: -74.2973 };

  const handleMarkerDrag = useCallback(
    async (lat: number, lng: number) => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();

        let ciudad = "";

        if (data.results?.length) {
          const components = data.results[0].address_components || [];
          ciudad =
            components.find((c: any) =>
              c.types.includes("locality")
            )?.long_name ||
            components.find((c: any) =>
              c.types.includes("administrative_area_level_2")
            )?.long_name ||
            "";
        }

        onChange({ lat, lng, ciudad });
      } catch (e) {
        onChange({ lat, lng, ciudad: "" });
      }
    },
    [onChange]
  );

  if (!isLoaded) return <div>Cargando mapa…</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
      <Marker
        position={center}
        draggable
        onDragEnd={(e) =>
          handleMarkerDrag(e.latLng!.lat(), e.latLng!.lng())
        }
      />
    </GoogleMap>
  );
}
