mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/satellite-streets-v11", // style URL
  center: bathroom.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a default Marker and add it to the map.
// const marker1 = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);

const el = document.createElement("div");
const width = 35;
const height = 35;
el.className = "marker";
el.style.backgroundImage = 'url("/assets/toilet-icon.png")';
el.style.width = `${width}px`;
el.style.height = `${height}px`;
el.style.backgroundSize = "100%";

// Add markers to the map.
new mapboxgl.Marker(el)
  .setLngLat(bathroom.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${bathroom.title}</h3><p>${bathroom.location}</p>`
    )
  )
  .addTo(map);
