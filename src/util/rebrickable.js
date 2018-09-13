export default {
    searchPart: (part_num, key, callback) => {
        let url = 'https://rebrickable.com/api/v3/lego/elements/' + part_num;
        let request = url + '?key=' + key;
        fetch(request).then(res => res.json()).then(
            (result) => callback.success(result),
            (error) => callback.error(error)
        );
    },
    searchSet: (set_num, key, callback) => {
        let url = 'https://rebrickable.com/api/v3/lego/sets/' + set_num;
        let request = url + '?key=' + key;
        fetch(request).then(res => res.json()).then(
            (result) => callback.success(result),
            (error) => callback.error(error)
        );
    }
}