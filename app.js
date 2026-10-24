// Domyślne miasta wyświetlane na start
const DEFAULT_CITIES = [
  { id: 'warsaw', name: 'Warszawa', country: 'Polska', timeZone: 'Europe/Warsaw' },
  { id: 'london', name: 'Londyn', country: 'Wielka Brytania', timeZone: 'Europe/London' },
  { id: 'new_york', name: 'Nowy Jork', country: 'USA (Wschód)', timeZone: 'America/New_York' },
  { id: 'tokyo', name: 'Tokio', country: 'Japonia', timeZone: 'Asia/Tokyo' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { id: 'los_angeles', name: 'Los Angeles', country: 'USA (Zachód)', timeZone: 'America/Los_Angeles' },
];

// Bogata baza popularnych miast do wyboru
const AVAILABLE_CITIES = [
  { name: 'Ateny', country: 'Grecja', timeZone: 'Europe/Athens' },
  { name: 'Auckland', country: 'Nowa Zelandia', timeZone: 'Pacific/Auckland' },
  { name: 'Bangkok', country: 'Tajlandia', timeZone: 'Asia/Bangkok' },
  { name: 'Berlin', country: 'Niemcy', timeZone: 'Europe/Berlin' },
  { name: 'Buenos Aires', country: 'Argentyna', timeZone: 'America/Argentina/Buenos_Aires' },
  { name: 'Chicago', country: 'USA (Środek)', timeZone: 'America/Chicago' },
  { name: 'Dubaj', country: 'ZEA', timeZone: 'Asia/Dubai' },
  { name: 'Helsinki', country: 'Finlandia', timeZone: 'Europe/Helsinki' },
  { name: 'Honolulu', country: 'Hawaje, USA', timeZone: 'Pacific/Honolulu' },
  { name: 'Hongkong', country: 'Chiny', timeZone: 'Asia/Hong_Kong' },
  { name: 'Johannesburg', country: 'RPA', timeZone: 'Africa/Johannesburg' },
  { name: 'Kair', country: 'Egipt', timeZone: 'Africa/Cairo' },
  { name: 'Kijów', country: 'Ukraina', timeZone: 'Europe/Kyiv' },
  { name: 'Londyn', country: 'Wielka Brytania', timeZone: 'Europe/London' },
  { name: 'Los Angeles', country: 'USA (Pacyfik)', timeZone: 'America/Los_Angeles' },
  { name: 'Madryt', country: 'Hiszpania', timeZone: 'Europe/Madrid' },
  { name: 'Melbourne', country: 'Australia', timeZone: 'Australia/Melbourne' },
  { name: 'Meksyk', country: 'Meksyk', timeZone: 'America/Mexico_City' },
  { name: 'Nowe Delhi', country: 'Indie', timeZone: 'Asia/Kolkata' },
  { name: 'Nowy Jork', country: 'USA (Wschód)', timeZone: 'America/New_York' },
  { name: 'Paryż', country: 'Francja', timeZone: 'Europe/Paris' },
  { name: 'Pekin', country: 'Chiny', timeZone: 'Asia/Shanghai' },
  { name: 'Reykjavik', country: 'Islandia', timeZone: 'Atlantic/Reykjavik' },
  { name: 'Rio de Janeiro', country: 'Brazylia', timeZone: 'America/Sao_Paulo' },
  { name: 'Rzym', country: 'Włochy', timeZone: 'Europe/Rome' },
  { name: 'San Francisco', country: 'USA (Pacyfik)', timeZone: 'America/Los_Angeles' },
  { name: 'Seul', country: 'Korea Płd.', timeZone: 'Asia/Seoul' },
  { name: 'Singapur', country: 'Singapur', timeZone: 'Asia/Singapore' },
  { name: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { name: 'Tokio', country: 'Japonia', timeZone: 'Asia/Tokyo' },
  { name: 'Toronto', country: 'Kanada', timeZone: 'America/Toronto' },
  { name: 'Vancouver', country: 'Kanada', timeZone: 'America/Vancouver' },
  { name: 'Warszawa', country: 'Polska', timeZone: 'Europe/Warsaw' }
].sort((a, b) => a.name.localeCompare(b.name, 'pl'));

// Stan aplikacji
let activeCities = [];
let is24HourFormat = true;
let isScrubbing = false;
let simulatedDate = null;

// Elementy DOM
const utcClockEl = document.getElementById('utc-clock');
const utcDateEl = document.getElementById('utc-date');
const utcDayPercentEl = document.getElementById('utc-day-percent');
const utcProgressFillEl = document.getElementById('utc-progress-fill');
const utcDayNightIconEl = document.getElementById('utc-daynight-icon');
const liveIndicatorEl = document.getElementById('live-indicator');
const clocksGridEl = document.getElementById('clocks-grid');
const clocksCountEl = document.getElementById('clocks-count');
const citySelectEl = document.getElementById('city-select');
const addCityBtn = document.getElementById('add-city-btn');
const resetDefaultBtn = document.getElementById('reset-default-btn');
const formatToggleButtons = document.querySelectorAll('#format-toggle .btn-toggle');
const timeSlider = document.getElementById('time-slider');
const scrubberValueLabel = document.getElementById('scrubber-value-label');
const resetScrubberBtn = document.getElementById('reset-scrubber-btn');

function getCurrentActiveDate() {
  return isScrubbing && simulatedDate ? simulatedDate : new Date();
}

// Inicjalizacja
function init() {
  loadSettings();
  populateCityDropdown();
  setupEventListeners();
  renderClocksGrid(getCurrentActiveDate());
  updateClock();
  setInterval(updateClock, 1000);
}

// Bezpieczne ładowanie ustawień
function loadSettings() {
  try {
    const savedCities = localStorage.getItem('world_clock_cities');
    if (savedCities) {
      activeCities = JSON.parse(savedCities);
    } else {
      activeCities = [...DEFAULT_CITIES];
    }
  } catch (e) {
    activeCities = [...DEFAULT_CITIES];
  }

  try {
    const savedFormat = localStorage.getItem('world_clock_format');
    if (savedFormat) {
      is24HourFormat = savedFormat === '24h';
      updateFormatButtons();
    }
  } catch (e) {
    is24HourFormat = true;
  }
}

function saveCities() {
  try {
    localStorage.setItem('world_clock_cities', JSON.stringify(activeCities));
  } catch (e) {
    console.warn('Nie można zapisać do localStorage', e);
  }
}

function saveFormat() {
  try {
    localStorage.setItem('world_clock_format', is24HourFormat ? '24h' : '12h');
  } catch (e) {
    console.warn('Nie można zapisać formatu', e);
  }
}

function updateFormatButtons() {
  formatToggleButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.format === (is24HourFormat ? '24h' : '12h'));
  });
}

// Uzupełnienie rozwijanej listy miast
function populateCityDropdown() {
  citySelectEl.innerHTML = '<option value="" disabled selected>➕ Wybierz miasto do dodania...</option>';
  AVAILABLE_CITIES.forEach(city => {
    const option = document.createElement('option');
    option.value = JSON.stringify(city);
    option.textContent = `${city.name} (${city.country}) – ${city.timeZone}`;
    citySelectEl.appendChild(option);
  });
}

// Konfiguracja zdarzeń
function setupEventListeners() {
  // Przełączanie 24h / 12h
  formatToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      is24HourFormat = btn.dataset.format === '24h';
      updateFormatButtons();
      saveFormat();
      updateClock();
    });
  });

  // Dodawanie miasta
  addCityBtn.addEventListener('click', () => {
    if (!citySelectEl.value) return;
    const selected = JSON.parse(citySelectEl.value);
    
    const exists = activeCities.some(c => c.timeZone === selected.timeZone && c.name === selected.name);
    if (exists) {
      alert(`Miasto ${selected.name} znajduje się już na Twojej liście.`);
      return;
    }

    activeCities.push({
      id: 'city_' + Date.now(),
      name: selected.name,
      country: selected.country,
      timeZone: selected.timeZone
    });

    saveCities();
    renderClocksGrid(getCurrentActiveDate());
    updateClock();
    citySelectEl.selectedIndex = 0;
  });

  // Przywracanie domyślnych
  resetDefaultBtn.addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślną listę zegarów?')) {
      activeCities = [...DEFAULT_CITIES];
      saveCities();
      renderClocksGrid(getCurrentActiveDate());
      updateClock();
    }
  });

  // Obsługa symulatora czasu
  timeSlider.addEventListener('input', (e) => {
    isScrubbing = true;
    liveIndicatorEl.textContent = '⏸ SYMULACJA';
    liveIndicatorEl.style.color = '#fbbf24';
    liveIndicatorEl.style.borderColor = 'rgba(251, 191, 36, 0.4)';
    liveIndicatorEl.style.background = 'rgba(251, 191, 36, 0.1)';
    resetScrubberBtn.style.display = 'inline-block';

    const totalMinutes = parseInt(e.target.value, 10);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth();
    const utcDateNum = now.getUTCDate();
    
    simulatedDate = new Date(Date.UTC(utcYear, utcMonth, utcDateNum, hours, minutes, 0));
    
    const formattedHour = String(hours).padStart(2, '0');
    const formattedMin = String(minutes).padStart(2, '0');
    scrubberValueLabel.textContent = `Symulacja UTC: ${formattedHour}:${formattedMin}`;
    
    updateClock();
  });

  // Powrót do trybu na żywo
  resetScrubberBtn.addEventListener('click', () => {
    isScrubbing = false;
    simulatedDate = null;
    liveIndicatorEl.textContent = '● LIVE';
    liveIndicatorEl.style.color = '#34d399';
    liveIndicatorEl.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    liveIndicatorEl.style.background = 'rgba(16, 185, 129, 0.15)';
    resetScrubberBtn.style.display = 'none';
    scrubberValueLabel.textContent = 'Czas bieżący (Tryb na żywo)';
    updateClock();
  });
}

// Niezawodne obliczanie różnicy czasu w minutach względem UTC
function getTimeZoneOffsetMinutes(timeZone, refDate) {
  try {
    const getWallClockUTC = (tz) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23'
      }).formatToParts(refDate);

      const map = {};
      parts.forEach(p => map[p.type] = p.value);
      return Date.UTC(
        parseInt(map.year, 10),
        parseInt(map.month, 10) - 1,
        parseInt(map.day, 10),
        parseInt(map.hour, 10),
        parseInt(map.minute, 10),
        parseInt(map.second, 10)
      );
    };

    const targetMs = getWallClockUTC(timeZone);
    const utcMs = getWallClockUTC('UTC');
    return Math.round((targetMs - utcMs) / 60000);
  } catch (err) {
    return 0;
  }
}

// Formatowanie plakietki przesunięcia względem UTC
function formatOffsetBadge(offsetMinutes) {
  if (offsetMinutes === 0) return { text: '±0h (Czas UTC)', type: 'equal' };
  
  const sign = offsetMinutes > 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  
  const formattedText = mins === 0
    ? `${sign}${hours}h względem UTC`
    : `${sign}${hours}h ${mins}m wzgl. UTC`;
    
  return {
    text: formattedText,
    type: offsetMinutes > 0 ? 'ahead' : 'behind'
  };
}

// Główna funkcja odświeżająca zegary
function updateClock() {
  const now = getCurrentActiveDate();

  // 1. Aktualizacja Głównego Zegara UTC
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();

  // Pasek postępu i slider
  const totalDaySeconds = utcHours * 3600 + utcMinutes * 60 + utcSeconds;
  const dayPercent = ((totalDaySeconds / 86400) * 100).toFixed(1);
  utcDayPercentEl.textContent = `${dayPercent}%`;
  utcProgressFillEl.style.width = `${dayPercent}%`;

  if (!isScrubbing) {
    timeSlider.value = utcHours * 60 + utcMinutes;
  }

  // Ikona słońca/księżyca dla UTC
  utcDayNightIconEl.textContent = (utcHours >= 6 && utcHours < 18) ? '☀️' : '🌙';

  // Formatowanie godziny UTC
  utcClockEl.textContent = formatTime(now, 'UTC');

  // Formatowanie daty UTC
  const utcDateFormatter = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dateFormatted = utcDateFormatter.format(now);
  utcDateEl.textContent = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  // 2. Aktualizacja Kart Miast Światowych
  renderClocksGrid(now);
}

// Formatowanie czasu (z uwzględnieniem 12h/24h)
function formatTime(date, timeZone) {
  const options = {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !is24HourFormat
  };
  return new Intl.DateTimeFormat('pl-PL', options).format(date);
}

// Renderowanie siatki zegarów
function renderClocksGrid(currentDate = getCurrentActiveDate()) {
  clocksCountEl.textContent = `${activeCities.length} ${pluralizeCities(activeCities.length)}`;

  // Jeśli liczba elementów się różni, przebuduj strukturę DOM
  if (clocksGridEl.children.length !== activeCities.length) {
    rebuildCardsDOM();
  }

  // Aktualizacja danych w kartach
  activeCities.forEach((city, index) => {
    const card = clocksGridEl.children[index];
    if (!card) return;

    try {
      // Czas w danym mieście
      const timeStr = formatTime(currentDate, city.timeZone);
      card.querySelector('.card-time').textContent = timeStr;

      // Data w danym mieście
      const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
        timeZone: city.timeZone,
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
      card.querySelector('.card-date').textContent = dateFormatter.format(currentDate);

      // Różnica strefy względem UTC
      const offsetMinutes = getTimeZoneOffsetMinutes(city.timeZone, currentDate);
      const offsetInfo = formatOffsetBadge(offsetMinutes);
      
      const badgeEl = card.querySelector('.card-diff-badge');
      badgeEl.textContent = offsetInfo.text;
      badgeEl.className = `card-diff-badge ${offsetInfo.type}`;

      // Wyznaczenie pory doby (Dzień / Noc)
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: city.timeZone,
        hour: 'numeric',
        hourCycle: 'h23'
      }).formatToParts(currentDate);
      const localHour = parseInt(parts.find(p => p.type === 'hour').value, 10);
      
      const isDay = localHour >= 6 && localHour < 19;
      const dayNightEl = card.querySelector('.card-daynight-tag');
      dayNightEl.className = `card-daynight-tag ${isDay ? 'day' : 'night'}`;
      dayNightEl.innerHTML = isDay ? '☀️ Dzień' : '🌙 Noc';

    } catch (err) {
      card.querySelector('.card-time').textContent = 'Błąd strefy';
    }
  });
}

// Przebudowa struktury kart DOM
function rebuildCardsDOM() {
  clocksGridEl.innerHTML = '';
  activeCities.forEach((city) => {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.dataset.id = city.id;

    card.innerHTML = `
      <div class="card-top">
        <div class="city-info">
          <h3>${city.name}</h3>
          <span class="country-name">${city.country} &bull; ${city.timeZone}</span>
        </div>
        <div class="card-actions">
          <button class="btn-remove" title="Usuń ${city.name}">✕</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-time">--:--:--</div>
        <div class="card-date">--</div>
      </div>
      <div class="card-footer">
        <span class="card-diff-badge">UTC</span>
        <span class="card-daynight-tag">☀️ Dzień</span>
      </div>
    `;

    // Bezpieczne usuwanie po ID
    card.querySelector('.btn-remove').addEventListener('click', () => {
      removeCityById(city.id);
    });

    clocksGridEl.appendChild(card);
  });
}

function removeCityById(cityId) {
  activeCities = activeCities.filter(c => c.id !== cityId);
  saveCities();
  renderClocksGrid(getCurrentActiveDate());
  updateClock();
}

function pluralizeCities(count) {
  if (count === 1) return 'strefa';
  if (count >= 2 && count <= 4) return 'strefy';
  return 'stref';
}

// Start
document.addEventListener('DOMContentLoaded', init);

