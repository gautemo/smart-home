const fetch = require('node-fetch');

const getNearby = async () => {
    const res = await fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', {
        'client-name': 'gautemo-smarthome'
    });
    const json = await res.json();
    const bentsebrugata = json.data.stations.find(s => s.station_id === '380');
    const myr = json.data.stations.find(s => s.station_id === '525');
    return { bentsebrugata, myr };
}

const nrAvailible = async () => {
    const stations = await getNearby();
    return { b: stations.bentsebrugata.num_bikes_available, m: stations.myr.num_bikes_available };
}

const text = async () => {
    const res = await nrAvailible();
    if (res.b < 2) {
        return `${res.b} bikes left, and ${res.m} at Myrløkka`;
    }
    return `${res.b}`;
}

module.exports = {
    text,
    nrAvailible
}