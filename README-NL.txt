STOCKTELLER – INSTALLATIE EN GEBRUIK
====================================

INHOUD
- index.html: de webapp
- styles.css: vormgeving voor telefoon en computer
- app.js: tellen, producten, lokale opslag, historiek en export
- manifest.webmanifest: PWA-installatiegegevens
- sw.js: offline cache (service worker)
- icons/: app-iconen

FUNCTIES
- Producten toevoegen, bewerken en verwijderen
- Inhoud per fles vastleggen
- Aantallen snel verhogen/verlagen of exact aanpassen
- Stockopnames met datum, naam en productregels bewaren
- Historiek terug bekijken, exporteren en oude telling terugzetten
- CSV-rapporten die met Excel kunnen worden geopend
- Volledige JSON-back-up downloaden en terugzetten
- Nederlandstalige interface
- Offline werking nadat de app online minstens één keer geladen is en de service worker geïnstalleerd is

BELANGRIJK: HOSTEN VOOR INSTALLATIE EN OFFLINE WERKING
Een PWA werkt niet volledig door index.html alleen lokaal te openen. De bestanden moeten op een HTTPS-webadres staan (localhost is voor ontwikkeling ook toegestaan), zodat de service worker kan werken.
1. Pak stockteller-pwa.zip uit.
2. Upload alle bestanden en de map icons naar een HTTPS-hostingdienst die statische websites ondersteunt.
3. Open de HTTPS-link op je telefoon en wacht tot de pagina geladen is.
4. Android/Chrome: open het browsermenu en kies "Installeren" of "Toevoegen aan startscherm".
5. iPhone/iPad: open de link in Safari, tik op Deel en kies "Zet op beginscherm". De precieze benaming kan per iOS-versie verschillen.
6. Open de geïnstalleerde app minstens één keer online. Daarna worden de appbestanden gecachet voor offline gebruik.

GEGEVENS EN PRIVACY
- Producten en stockopnames worden lokaal in de browseropslag (localStorage) op dit toestel en voor dit webadres opgeslagen.
- Gegevens worden niet naar een server gestuurd door deze app.
- Lokale opslag is geen vervanging voor een back-up. Download geregeld een JSON-back-up via Gegevens.
- Browsergegevens wissen, privé/incognito gebruiken of een andere browser/toestel gebruiken kan de lokale gegevens verwijderen of onbeschikbaar maken.
- CSV-export is bedoeld voor rapporten; JSON-back-up bevat zowel producten als historiek.
- Er is geen automatische synchronisatie tussen meerdere toestellen.

OPMERKING
Dit is een zelfstandige, client-side PWA. Er is geen account of backend vereist. Test vóór operationeel gebruik eerst met een paar testproducten en maak een back-up.
