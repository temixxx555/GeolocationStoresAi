const findBtn = document.getElementById("find-btn");
const infoContainer = document.getElementById("display-information");
const toggle = document.getElementById("menu-toggle");
const cancelBtn = document.getElementById("cancel-btn");
const navLinks = document.getElementById("nav-links");
const stopBtn = document.getElementById("stop-btn")

let watchId = null;

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
};

// To get the state, country or any human-readable location like a city, from latitude and longitude,
// you need to use a process called reverse geocoding.

const getLocationDetails = async (lat, lon) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  );
  const data = await response.json();

  const address = data.address;
  const state = address.state;
  const country = address.country;

  console.log(address);
  infoContainer.innerHTML = `
        <div class="information">
            <p>You have been found muhahaha</p>
            <p>Address: ${address.road} ${address.suburb}, ${address.city}, ${address.state}, ${address.country}</p>
            <p>State: ${state}</p>
            <p>Country: ${country}</p>
        </div>
    `;
};

let map = null;
let marker = null;

const successCallback = (position) => {
  const { latitude, longitude } = position.coords;

  if (!map) {
    map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    marker = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup("You are here!")
      .openPopup();
  }
  else
  {
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude]);
  }

  getLocationDetails(latitude, longitude);
};

const errorCallback = (error) => {
  console.log("Geolocation Error: ", error);
};

// const findUser = (successcb, errorcb, otherop = null) => {
//   if (otherop !== null) {
//     navigator.geolocation.watchPosition(successCallback, errorCallback, options);
//   } else {
//     navigator.geolocation.watchPosition(successCallback, errorCallback);
//   }
// };

findBtn.onclick = () => {
    if (!watchId) 
    {
        watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    }
}

stopBtn.onclick = () => {
    if (watchId != null)
    {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        console.log("Tracking stopped.");
    }
}

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

cancelBtn.addEventListener("click", () => {
  navLinks.classList.remove("active");
});
