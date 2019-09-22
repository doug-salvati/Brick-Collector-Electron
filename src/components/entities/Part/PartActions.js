const PartFeatureActions = [
    {
        type: 'setsSent',
        worker: (event, entities) => ({
            entities,
            loading: false,
        })
    },
];

export default PartFeatureActions;