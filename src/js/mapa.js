(function () {
  const lat = 34.040967;
  const lng = -118.1618621;
  const mapa = L.map("mapa").setView([lat, lng], 12);
  let marker;

  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //Setting the pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  //Detecting the marker position

  marker.on("moveend", function (e) {
    marker = e.target;

    const position = marker.getLatLng();

    mapa.panTo(new L.LatLng(position.lat, position.lng));

    //Getting Address from the marker position

    geocodeService
      .reverse()
      .latlng(position, 13)
      .run(function (error, result) {
        marker.bindPopup(result.address.LongLabel);

        document.querySelector(".calle").textContent =
          result?.address?.Address ?? "";
        document.querySelector("#calle").value = result?.address?.Address ?? "";
        document.querySelector("#lat").value = result?.latlng?.lat ?? "";
        document.querySelector("#lng").value = result?.latlng?.lng ?? "";
      });
  });
})();
