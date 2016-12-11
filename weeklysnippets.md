Oppimispäiväkirja

Harjoitustyön aikataulutus ei mennyt täysin nappiin. 
Alkuperäisestä suunitelmasta, jossa oli hakea lähin uimaranta,
sää uimarannalla, ja uimarannan vedenlaatutiedot poikettiin hieman.
Loppujen lopuksi asikasohjelma osaa hakea koordinaattien tai osoitteen perusteella 10 lähintä järveä siinä kunnassa missä koordinaatit ovat 
ja lähimmän suurimman kaupungin säätiedoista lämpötilan.

Rajapinta käyttää: 
	- openweathermap API:a säätietojen hakuun 
	- maps.googleapis.com/maps/api/place kaupunkien hakemiseen
	- api.geonames.org/findNearbyPlaceNameJSON kunnan nimien hakemiseen
	- syke järvirajapintaa järvien hakemiseen
	
	- lisäksi client käyttää google maps apia kartan näyttämiseen käyttöliittymässä



Tehtyjen hommien aikataulu:

Ensimmäinen viikko:

Miska:
- valmiisiin rajapintohin tutustuminen ja oman toteutuksen ideointia. 
- suunnitelman kirjoitusta

Atte:
- Rajapintoihin perehtymistä
- Docker harjoitustyön tekoa


viimeinen viikko:

Miska:
- toiminnot joissa haetaan lähin kaupunki koordinaateista, sekä  säätieto kaupungin nimellä
- karttasivu, joka osaa täyttää formin kartan klikkauksen koordinaattien perusteella.
- karttaan markkerien merkkaaminen
- rajapinnan dokumentaation kirjoitusta. 

Atte:
- Frontin kanssa kikkailua.
- Backendii kaikki muu mitä jää jäljelle Miskalta.
- Heroku deploy

opitut asiat:

Miska:
- yleistä node.js toimintaa, sillä en ole aiemmin tehnyt node.js:sällä 
- Rajapintojen dokumentaation tutustuminen ja oikeanlaisten valmiiden palveluiden löytäminen
- http get pyyntöjen kanssa kikkailu 
- google maps -apin kanssa toiminta

Atte:
- Jonkin verran lisää node.js.
- Ajankäyttöö pitäis parantaa mutta docker ja muut kurssit söi sitä aikalailla.
- Palvelun pisto herokuu.
- Jotkut suomalaiset apit(järvi api) eivät tue ääkkösiä vaikka niiden datassa löytyy ääkkösiä.