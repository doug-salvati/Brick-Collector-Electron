const sorter = (a, b) => a.p_id > b.p_id;
const removeSpares = (parts) => {
   const sorted = parts.sort(sorter);
   return sorted.filter((curr, idx) => {
    const prev = sorted[idx - 1];
    return !prev || (curr.p_id !== prev.p_id);
   });
}

export default removeSpares;