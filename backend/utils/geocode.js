import axios from "axios";

export async function geocodeAddress(address) {
  const url = "https://nominatim.openstreetmap.org/search";

  const res = await axios.get(url, {
    params: {
      q: address,
      format: "json",
      limit: 1,
    },
    headers: {
      "User-Agent": "Zenflow-App",
    },
  });

  if (!res.data.length) {
    throw new Error("Unable to geocode address");
  }

  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon),
  };
}
