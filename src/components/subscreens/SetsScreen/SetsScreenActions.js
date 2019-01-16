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
                quantity: match.quantity + new_set.quantity,
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
    {
        type: 'setDeleted',
        worker: (event, old_set, context) => {
            const match = context.state.items.find((elt) => elt.s_id === old_set.s_id);
            const idx = context.state.items.indexOf(match);
            let new_sets = context.state.items.slice();
            new_sets.splice(idx, 1);
            return ((old_state) => {
                return {items: new_sets, count: old_state.count - 1};
            });
        }
    }
];

export default SetsScreenActions;