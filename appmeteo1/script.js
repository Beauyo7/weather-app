// Charger la configuration des villes depuis config.json
const fetchCityConfig = async () => {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des villes : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Récupérer les données météo pour une ville donnée
const fetchWeatherData = async (latitude, longitude) => {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=sunrise,sunset&timezone=Europe/Paris`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur API météo : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Formatter les heures au format HH:mm
const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Mettre à jour l'interface utilisateur
const displayWeatherData = (city, weather) => {
    const container = document.getElementById('weather-container');
    container.innerHTML = `
        <h2>${city}</h2>
        <p><span>Température :</span> ${weather.current_weather.temperature}°C</p>
        <p><span>Vitesse du vent :</span> ${weather.current_weather.windspeed} km/h</p>
        <p><span>Lever du soleil :</span> ${formatTime(weather.daily.sunrise[0])}</p>
        <p><span>Coucher du soleil :</span> ${formatTime(weather.daily.sunset[0])}</p>
    `;
};

// Navigation entre les villes
let currentCityIndex = 0;
let cities = [];

// Fonction principale pour mettre à jour les données affichées
const updateWeatherDisplay = async () => {
    const { city, latitude, longitude } = cities[currentCityIndex];
    const weatherData = await fetchWeatherData(latitude, longitude);
    if (weatherData) {
        displayWeatherData(city, weatherData);
    }
};

// Gestion des boutons de navigation
document.getElementById('prev-city').addEventListener('click', () => {
    currentCityIndex = (currentCityIndex - 1 + cities.length) % cities.length;
    updateWeatherDisplay();
});

document.getElementById('next-city').addEventListener('click', () => {
    currentCityIndex = (currentCityIndex + 1) % cities.length;
    updateWeatherDisplay();
});

// Rafraîchir automatiquement les données toutes les heures
const startAutoRefresh = () => {
    setInterval(() => {
        updateWeatherDisplay();
    }, 3600000); // 3600000ms = 1 heure
};

// Chargement des données et initialisation
const loadWeatherApp = async () => {
    cities = await fetchCityConfig();
    if (cities.length > 0) {
        updateWeatherDisplay();
        startAutoRefresh(); // Activer la mise à jour automatique
    }
};

document.addEventListener('DOMContentLoaded', loadWeatherApp);
