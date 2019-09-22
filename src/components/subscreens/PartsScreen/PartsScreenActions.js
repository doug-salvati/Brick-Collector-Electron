const PartsScreenActions = [
    {
        type: 'partsSent',
        worker: (event, list) => ({
            count: list.part_count,
            items: list.parts,
        })
    },
    {
        type: 'newPartSent',
        worker: (event, new_part, context) => {
            let match;
            if (match = context.state.items.find((elt) => elt.id === new_part.id)) {
              let modified = Object.assign({}, match, {
                quantity: match.quantity + new_part.quantity,
                loose: match.loose + new_part.loose
              });
              if (context.state.featured) {
                context.setState({featured: modified});
              }
              let new_parts = context.state.items.slice();
              new_parts[context.state.items.indexOf(match)] = modified;
              return {items: new_parts};
            } else {
              return ((old_state) => ({
                count: old_state.count + 1,
                items: old_state.items.concat(new_part)
              }));
            }
          },
    },
    {
        type: 'partDeleted',
        worker: (event, old_part, context) => {
            const match = context.state.items.find((elt) => elt.id === old_part.id);
            const idx = context.state.items.indexOf(match);
            let new_parts = context.state.items.slice();
            new_parts.splice(idx, 1);
            return ((old_state) => {
                return {items: new_parts, count: old_state.count - 1};
            });
        }
    }
];

export default PartsScreenActions;