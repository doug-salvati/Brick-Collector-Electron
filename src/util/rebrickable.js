import { getColorCodeByName } from '../constants/colors';

const KEY = global.rebrickable;
const addKey = (url, otherParams) => `${url}?key=${KEY}${otherParams || ''}`;
const createURL = (endpoint, otherParams) => addKey(`https://rebrickable.com/api/v3/lego/${endpoint}`, otherParams);
const searchPart = partNum => createURL(`elements/${partNum}/`);
const searchMold = moldNum => createURL(`parts/${moldNum}/`);
const searchMoldColor = (moldNum, color) => createURL(`parts/${moldNum}/colors/${getColorCodeByName(color)}/`);
const searchSet = setNum => createURL(`sets/${setNum}/`);
const searchTheme = themeId => createURL(`themes/${themeId}/`);
const searchInventory = setNum => createURL(`sets/${setNum}/parts/`, '&page_size=10000');
const searchMinifigInventory = setNum => createURL(`sets/${setNum}/minifigs/`);
const searchMinifigParts = minifig => createURL(`minifigs/${minifig}/parts`);

const found = result => result.detail !== 'Not found.';

const fetchData = async (requests, onError) => {
    try {
        const results = [];
        let response, data;
        for (let request of requests) {
            response = await fetch(request);
            data = await response.json();
            results.push(data);
        }
        return results;
    } catch (error) {
        onError(error); 
    }
};

const deDup = parts => {
    const deDuped = [];
    let existing;
    for (let part of parts) {
        if (!part.is_spare) {
            existing = deDuped.find(entry => (entry.part.part_num === part.part.part_num) && (entry.color.id === part.color.id));
            if (!existing) {
                deDuped.push(part);
            } else {
                existing.quantity += part.quantity;
            }
        }
    }
    return deDuped
}

const gateway = {
    searchPart: async (partNum, callback) => {
        const [ data ] = await fetchData([searchPart(partNum)], callback.error);
        callback.success(data);
    },
    searchPartWithColor: async (moldNum, color, callback) => {
        const [ moldData, colorData ] = await fetchData([ searchMold(moldNum), searchMoldColor(moldNum, color) ], callback.error);
        if (found(moldData) && found(colorData)) {
            callback.success({
                element_id: colorData.elements[0] || `${moldData.part_num} (${color})`,
                part: moldData,
                color: { name: color },
                element_img_url: colorData.part_img_url,
            });
        } else {
            callback.success({});
        }
    },
    searchSet: async (setNum, callback) => {
        const [ setData ] = await fetchData([ searchSet(setNum) ], callback.error);
        const themeId = setData.theme_id;
        const [ themeData ] = await fetchData([ searchTheme(themeId) ], callback.error);
        callback.success({...setData, theme: themeData.name});
    },
    getPartsInSet: async (setNum, callback) => {    
        const [ setData, minifigData ] = await fetchData([ searchInventory(setNum), searchMinifigInventory(setNum) ], callback.error);
        let minifigParts = [];
        for (let minifig of minifigData.results) {
            const [data] = await fetchData([ searchMinifigParts(minifig.set_num) ], callback.error);
            minifigParts = [...minifigParts, ...data.results.map(part => ({ ...part, quantity: part.quantity * minifig.quantity }))];
        }
        const setParts = setData.results;
        const allParts = deDup([...setParts, ...minifigParts]);
        callback.success(allParts.map(result =>
            {
                return {
                    id: (result.element_id && result.element_id.substring(0, 64)) ||
                        (`${result.part.part_num} (${result.color.name})`).substring(0, 64),
                    title: result.part.name.substring(0, 100),
                    img: result.part.part_img_url,
                    color: result.color.name.substring(0, 100),
                    quantity: result.quantity,
                }
            }).filter(elt => elt !== null));
        }
};

export default gateway;