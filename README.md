Tässä tiedostossa on ryhmän palbobaggins projektisuunnitelma. Ryhmään kuuluu
Atte Haapanen, 228855, ja Miska Melkinen, 234362.

Projektissa käyttämämme apit ovat: jokin sääpalvelun apia (esimerkiksi Accuweather tai Yahoo weather), googlemaps api ja
tampereen Syke pintavedenlaatutiedot rajapintaa. Näistä rajapinnoista
muodostamme oman rajapinnan. Rajapintaamme voi käyttää palveluna selaimella.
Palvelun ideana on syöttää sijainti, jonka mukaan näytetään lähimmät uimaran-
nat, niiden vedenlaatu ja siellä vallitseva sää. Palvelu näyttää myös reitin
valitulle rannalle käyttäjän sijainnista.

Lisävaatimuksina aiomme käyttää jatkuvaa integraatiota, jonka toteutamme
buildaamalla, ajamalla testejä ja deployaamalla jokaisella commitilla. Tähän
valittava toteutus ei ole vielä varmaa.

Rajapintaa kehitettään rajapinnan kuvauskielen avulla, mahdollisia vaihtoehtoja
kuvauskieleksi ovat esimerkiksi Swagger tai Raml. 

Projektin aikana pidämme viikottaista oppimispäiväkirjaa, johon kirjataan
viikon aikana tehdyt työt ja suunnitelmat seuraavalle viikolle.

ideoita:
1. alkotuotehaku + googlemaps joka näyttää missä lähin haluttu pullo
2. jokin sääpalvelu + googlemaps + tampereen soutuvenerennat tai uimarantojen
vedenlaatu -> palvelu kertoo missä pääsee uimaan ja milloin on hyvä keli
3. visitTampere Api + googlemaps + sääpalvelu -> kopio visittampere palvelun 
toiminnasta
4. Moves APi https://dev.moves-app.com/ + Twitter -> palveluun tehdään käyttäjä-
profiilija ja käyttäjä kirjaa palveluun kaikki liikantasuoritukset sitten
palvelu automattisesti laittaa uuden päivityksen twitteriin että nyt juostu
näin paljon.
5. https://fengshui-api.com/ + google calendar -> fengshuista tehdään joku haku,
että onko hyvä päivä tms. ja tulos kirjoitetaan kalenteriin


Yahoo weather avaimet
Client ID (Consumer Key)
dj0yJmk9Y1hPZkI4b3phTjdhJmQ9WVdrOWNVcE1VR0ZVTkdrbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD01Yg--
Client Secret (Consumer Secret)
0a02624f9c07c9c125a9c9fb238af58fb2d476d4

Heroku osoite:
http://palbobaggins.herokuapp.com/
