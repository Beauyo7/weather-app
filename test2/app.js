const fetchWeatherDataForCarousel = async () => {
    const cities = [
      { name: "Lille", latitude: 50.62925, longitude: 3.057256 },
      { name: "Nantes", latitude: 47.218371, longitude: -1.553621 },
      { name: "Toulouse", latitude: 43.604652, longitude: 1.444209 },
      { name: "Strasbourg", latitude: 48.573405, longitude: 7.752111 },
      { name: "Bordeaux", latitude: 44.837789, longitude: -0.57918 }
    ];
  
    const carousel = document.getElementById("carousel");
  
    try {
      for (const city of cities) {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true&daily=sunrise,sunset&timezone=Europe/Paris`;
        const response = await fetch(apiUrl);
  
        if (!response.ok) {
          throw new Error(`Erreur API météo pour ${city.name} : ${response.status}`);
        }
  
        const weatherData = await response.json();
        const { current_weather, daily } = weatherData;
  
        const cityCard = document.createElement("div");
        cityCard.classList.add("city-card");
  
        cityCard.innerHTML = `
          <h2>${city.name}</h2>
          <p>Température : ${Math.round(current_weather.temperature)}°C</p>
          <p>Vent : ${current_weather.windspeed} km/h</p>
          <p>Humidité : ${
            current_weather.relative_humidity !== undefined
              ? `${current_weather.relative_humidity}%`
              : "N/A"
          }</p>
          <p>Lever : ${new Date(daily.sunrise[0]).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}</p>
          <p>Coucher : ${new Date(daily.sunset[0]).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}</p>
        `;
  
        carousel.appendChild(cityCard);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };
  
  let currentIndex = 0;
  
  // Gestion des boutons de navigation
  const updateCarousel = () => {
    const carousel = document.getElementById("carousel");
    const totalItems = carousel.children.length;
  
    if (currentIndex < 0) currentIndex = totalItems - 1;
    if (currentIndex >= totalItems) currentIndex = 0;
  
    const offset = -currentIndex * 100; // Décale le carrousel
    carousel.style.transform = `translateX(${offset}%)`;
  };
  
  document.getElementById("prevBtn").addEventListener("click", () => {
    currentIndex--;
    updateCarousel();
  });
  
  document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex++;
    updateCarousel();
  });
  
  // Chargement initial
  fetchWeatherDataForCarousel();
  