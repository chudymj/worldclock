# Zegar Światowy (World Clock)

Aplikacja internetowa wyświetlająca czas na świecie z **czasem uniwersalnym (UTC)** jako głównym punktem odniesienia.

## Funkcje
- **Główny zegar UTC (Coordinated Universal Time)**:
  - Duży, czytelny wyświetlacz cyfrowy (godziny, minuty, sekundy).
  - Pełna data w języku polskim.
  - Wskaźnik postępu doby UTC (0-100%).
  - Wskaźnik pory dnia i nocy (ikona słońca / księżyca).
- **Zegary miast na świecie**:
  - Domyślnie: Warszawa, Londyn, Nowy Jork, Tokio, Sydney, Los Angeles.
  - Wyświetlanie lokalnego czasu, daty oraz różnicy względem UTC (np. `+2h względem UTC`, `-5h względem UTC`).
  - Wskaźnik dnia/nocy dla każdej strefy czasowej.
- **Dodawanie i usuwanie miast**:
  - Lista popularnych miast ze wszystkich kontynentów.
  - Możliwość dodawania własnych miast i usuwania zbędnych kart.
  - Zapisywanie konfiguracji w pamięci przeglądarki (`localStorage`).
- **Symulator / Przesuwanie czasu (Time Scrubber)**:
  - Suwak pozwalający przesuwać godzinę UTC i natychmiast sprawdzać odpowiednik w pozostałych strefach czasowych.
  - Szybki powrót do trybu na żywo jednym kliknięciem.
- **Format 24h / 12h**:
  - Przełącznik formatu czasu w nagłówku.

## Uruchomienie
Wystarczy otworzyć plik `index.html` w dowolnej przeglądarce internetowej (np. Chrome, Firefox, Safari, Edge), albo uruchomić lokalny serwer:
```bash
python3 -m http.server 8000
```
Następnie przejść pod adres `http://localhost:8000`.
