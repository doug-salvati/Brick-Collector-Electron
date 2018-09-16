const Rebrickable = {
    searchPart: (part_num, key, callback) => {
        let url = `https://rebrickable.com/api/v3/lego/elements/${part_num}`;
        let request = `${url}?key=${key}`;
        fetch(request).then(res => res.json()).then(
            (result) => callback.success(result),
            (error) => callback.error(error)
        );
    },
    searchSet: (set_num, key, callback) => {
        let url = `https://rebrickable.com/api/v3/lego/sets/${set_num}`;
        let request = `${url}?key=${key}`;
        fetch(request).then(res => res.json()).then(
            (result) => Rebrickable.searchTheme(result, key, callback),
            (error) => callback.error(error)
        );
    },
    searchTheme: (entity, key, callback) => {
        let url = `https://rebrickable.com/api/v3/lego/themes/${entity.theme_id}`;
        let request = `${url}?key=${key}`;
        fetch(request).then(res => res.json()).then(
            (result) => callback.success({...entity, theme: result.name}),
            (error) => callback.error(error)
        )
    },
    getPartsInSet: (set_num, key, callback) => {
        let url = `https://rebrickable.com/api/v3/lego/sets/${set_num}/parts`;
        let request = `${url}?key=${key}&page_size=10000`;
        fetch(request).then(res => res.json()).then(
            (result) => callback.success(result.results),
            (error) => callback.error(error)
        )
    }
};

export default Rebrickable;