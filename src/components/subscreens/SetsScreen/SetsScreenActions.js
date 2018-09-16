const SetsScreenActions = [
    {
        type: 'setsSent',
        worker: (event, list) => ({
            count: list.set_count,
            items: list.sets,
        })
    },
    {
        type: 'newSetSent',
        worker: (event, new_set, context) => {
            let match;
            if (match = context.state.items.find((elt) => elt.s_id === new_set.s_id)) {
              let modified = Object.assign({}, match, {
                quantity: match.quantity + 1,
              });
              if (context.state.featured) {
                context.setState({featured: modified});
              }
              let new_sets = context.state.items.slice();
              new_sets[context.state.items.indexOf(match)] = modified;
              return {items: new_sets};
            } else {
              return ((old_state) => ({
                count: old_state.count + 1,
                items: old_state.items.concat(new_set)
              }));
            }
          },
    },
    /*{
        type: 'partDeleted',
        worker: (event, old_part, context) => {
            const match = context.state.items.find((elt) => elt.p_id === old_part.p_id);
            const idx = context.state.items.indexOf(match);
            let new_parts = context.state.items.slice();
            new_parts.splice(idx, 1);
            return ((old_state) => {
                return {items: new_parts, count: old_state.count - 1};
            });
        }
    } */
];

export default SetsScreenActions;