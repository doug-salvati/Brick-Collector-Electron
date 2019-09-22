const SetFeatureActions = [
    {
        type: 'partsSent',
        worker: (event, entities) => ({
            entities,
            loading: false,
        })
    },
];

export default SetFeatureActions;