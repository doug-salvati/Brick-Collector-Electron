export function registerActions(ipc, actions, context) {
    for (let action of actions) {
        ipc.on(action.type, (event, payload) => {
            console.info(`[INFO] inbound event: ${action.type}`);
            context.setState(action.worker(event, payload, context));
        });
    }
}

export function removeActions(ipc, actions) {
    for (let action of actions) {
        ipc.removeAllListeners(action.type);
    }
}