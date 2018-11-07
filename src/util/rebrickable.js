const key = global.rebrickable;
import { ColorIDs } from '../data/colors';

const Rebrickable = {
    searchPart: (part_num, callback) => {
        let url = `https://rebrickable.com/api/v3/lego/elements/${part_num}`;
        let request = `${url}?key=${key}`;
        fetch(request).then(res => res.json()).then(
            (result) => callback.success(result),
            (error) => callback.error(error)
        );
    },
    searchMold: (part_num, callback) => {
        let url = `https://rebrickable.com/api/v3/lego/parts/${part_num}`;
        let request = `${url}?key=${key}`;
        fetch(request).then(res => res.json()).then(
            (result) => callback.success(result),
            (error) => callback.error(error)
        )
    },
    searchPartWithColor: (part_num, color, callback) => {
        Rebrickable.searchMold(part_num, {
            success: moldResult => {
                if (moldResult.detail === 'Not found.') {
                    callback.success({});
                } else {
                    let url = `https://rebrickable.com/api/v3/lego/parts/${part_num}/colors/${ColorIDs[color] || 10000}`;
                    let request = `${url}?key=${key}`;
                    fetch(request).then(res => res.json()).then(
                        (colorResult) => {
                            if (colorResult.detail === 'Not found.') {
                                callback.success({});
                            } else if (colorResult.elements.length) {
                                Rebrickable.searchPart(colorResult.elements[0], callback);
                            }
                            else {
                                callback.success({
                                    element_id: `${moldResult.part_num} (${color})`,
                                    part: {
                                        name: moldResult.name
                                    },
                                    color: {
                                        name: color
                                    },
                                    element_img_url: colorResult.part_img_url
                                })
                            }
                        },
                        (error) => callback.error(error)
                    );
                }
            },
            error: callback.error
        });
    },
    searchSet: (set_num, callback) => {
        let url = `https://rebrickable.com/api/v3/lego/sets/${set_num}`;
        let request = `${url}?key=${key}`;
        fetch(request).then(res => res.json()).then(
            (result) => Rebrickable.searchTheme(result, callback),
            (error) => callback.error(error)
        );
    },
    searchTheme: (entity, callback) => {
        let url = `https://rebrickable.com/api/v3/lego/themes/${entity.theme_id}`;
        let request = `${url}?key=${key}`;
        fetch(request).then(res => res.json()).then(
            (result) => callback.success({...entity, theme: result.name}),
            (error) => callback.error(error)
        )
    },
    getPartsInSet: (set_num, callback) => {
        let url = `https://rebrickable.com/api/v3/lego/sets/${set_num}/parts`;
        let request = `${url}?key=${key}&page_size=10000`;
        fetch(request).then(res => res.json()).then(
            (result) => callback.success(result.results.map(result => ({
                p_id: result.element_id,
                title: result.part.name,
                img: result.part.part_img_url,
                color: result.color.name,
                quantity: result.quantity,
            }))),
            (error) => callback.error(error)
        )
    }
};

export default Rebrickable;