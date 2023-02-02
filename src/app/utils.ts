export function isNight(): boolean {    // A very crude function, returns true between 5pm and 7am
    let hour: number = new Date().getHours();
    return hour >= 17 || hour <= 6 ? true : false;
}