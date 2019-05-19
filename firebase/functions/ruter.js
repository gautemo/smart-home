const EnturService = require('@entur/sdk').default;

const service = new EnturService({ clientName: 'gautemo-smarthome' });

const getAdvokatDehlis = async () => {
    const params = {
        timeRange: 60 * 30,
    }
    const res = await service.getStopPlaceDepartures("NSR:StopPlace:6372", params);
    const fiftyfour = res.filter(b => b.destinationDisplay.frontText === 'Tjuvholmen');
    const thiryseven = res.filter(b => b.destinationDisplay.frontText === 'Helsfyr');
    return { fiftyfour, thiryseven };
}

const getMinutesDiff = async () => {
    const busses = await getAdvokatDehlis();
    const fiftyfour = [];
    const thiryseven = [];
    for (const b of busses.fiftyfour) {
        fiftyfour.push(calcMinutesDiff(b.aimedDepartureTime));
    }
    for (const b of busses.thiryseven) {
        thiryseven.push(calcMinutesDiff(b.aimedDepartureTime));
    }
    return { fiftyfour, thiryseven };
}

const getAsText = async () => {
    const minutes = await getMinutesDiff();
    return `54 arrives in ${minutes.fiftyfour.join(', ')} minutes and 37 arrives in ${minutes.thiryseven.join(', ')} minutes.`;
}

const calcMinutesDiff = time => {
    const now = new Date();
    const arrive = new Date(time);
    const sec = Math.abs(arrive - now) / 1000;
    return Math.floor(sec / 60) % 60;
}

module.exports = {
    text: getAsText,
    minutes: getMinutesDiff
}