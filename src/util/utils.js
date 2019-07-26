const pick = array => array[Math.floor(Math.random() * array.length)];

const mapObject = (object, iteratee) => {
    const newObject = {};
    Object.keys(object).map((key, index) => {
        newObject[key] = iteratee(key, object[key]);
    });
    return newObject;
}

module.exports = {
    pick,
    mapObject,
};