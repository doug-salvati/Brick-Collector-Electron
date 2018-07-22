import {ipcRenderer} from 'electron';

const fire = (type) => {
    ipcRenderer.send(type);
}

export default fire;