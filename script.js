
let APIkey; // varibel där jag sparat api-nyckeln.
let planets; 

// Skapar en post funktion för att komma åt api-key.
let getKey = async () => {
    try {
        let response = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
            method: 'POST',
            headers: {'x-zocom': 'keys'}
        })

        if(!response.ok) {
            throw new Error('failed to load data')
        }

        const data = await response.json();
        APIkey = data.key; // Omvandlar min API-nyckel till en sträng istället för ett objekt.
        
    } catch(error) {
        console.error('Network Error:', error);
    }
}

// Get funktion för att hämta våra planeter i solsystemet
let getPlanets = async () => {

    try {
        let resp = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies', {
            method: 'GET',
            headers: {'x-zocom': APIkey}
        })

        if(!resp.ok) {
            throw new Error('failed to load data')
        }

        const data = await resp.json();
        planets = data.bodies;
    
        // Kallar på min funktion appendContent för att få ut planeterna på sidan.
        appendContent();

    } catch(error) {
        console.error('Network Error:', error);
    }
}

// en funktion för att vänta på min api-nyckel ska hämtas, annars blir min varibel undefined.
async function saveKey() {
    await getKey();
    await getPlanets();
}

saveKey(); // kallar på funktionen.

// funktion för att loopa ut objektet på webben.
const appendContent = () => {
    let planetsContainer = document.querySelector('.planets-container');


    planets.forEach(element => {
        let planetItem = document.createElement('div'); // skapar en div för varje planet
        planetsContainer.append(planetItem); // appendar den nya diven i min container som jag skapat i html.

        const planetPage = document.querySelector('.planet-information-page');
        planetPage.style.display = 'none';

        planetItem.addEventListener('click', () => {
            let clickedPlanet = element;
            showPlanets(clickedPlanet);
        });

        // sätter ett unikt class-namn till planeterna för att kunna style enskilt.
        planetItem.classList.add(`planet-${element.name}`);
    })

    // Funktion som skall köras när användaren klickar på en planet.
    const showPlanets = (clickedPlanet) => {
        // Skapar en overlay när användaren klickar på en planet
        const planetIdBlock = document.createElement('div');
        planetIdBlock.classList.add('overlay'); 

        planetIdBlock.style.display = 'block';
        document.body.append(planetIdBlock);

        // Skapar/hämtar alla element till informationssidan.
        const planetPage = document.querySelector('.planet-information-page');
        planetIdBlock.append(planetPage);
        planetPage.style.display = 'flex';

        const planetName = document.querySelector('.planet-title');
        planetName.textContent = clickedPlanet.name;

        const planetLatinName = document.querySelector('.latin-name');
        planetLatinName.textContent = clickedPlanet.latinName;

        const planetParagraph = document.querySelector('.info-paragraph');
        planetParagraph.textContent = clickedPlanet.desc;

        const cm = document.querySelector('.circumference');
        cm.textContent = clickedPlanet.circumference + ' km';

        const km = document.querySelector('.kilometers');
        km.textContent = clickedPlanet.distance + ' km';

        const maxTemp = document.querySelector('.max-temperature');
        maxTemp.textContent = clickedPlanet.temp.night + 'C';

        const minTemp = document.querySelector('.min-temperature');
        minTemp.textContent = clickedPlanet.temp.day + 'C';

        const moons = document.querySelector('.moons');
        moons.textContent = clickedPlanet.moons.join(", ");

        planetPage.classList.add(`overlay-${clickedPlanet.name}`);
        const eclipes = document.querySelector('.eclipse-style');
        eclipes.classList.add(`eclipse-${clickedPlanet.name}`)
    }
}
