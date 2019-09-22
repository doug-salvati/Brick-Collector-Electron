import React, {Component} from 'react';
import {ipcRenderer} from 'electron';

class AddPartForm extends Component {
    handleSubmit() {
        let new_part = {
            id: document.getElementById('form-pid').value,
            title: document.getElementById('form-title').value,
            color: document.getElementById('form-color').value,
            img: 'will be overridden',
            quantity: parseInt(document.getElementById('form-qty').value),
            loose: parseInt(document.getElementById('form-qty').value),
        };
        ipcRenderer.send('addPart', new_part);
        current_window.close();
    }    
    render() {
        return (
            <div>
                <div>
                    Part ID: <input type='text' id='form-pid'/>
                    Title: <input type='text' id='form-title'/>
                    Color: <input type='text' id='form-color'/>
                    Quantity: <input type='number' id='form-qty'/>
                </div>
                <button id='part-add-cancel' onClick={() => current_window.close()}>Cancel</button>
                <button id='part-add-done' onClick={this.handleSubmit}>Submit</button>
            </div>
        )
    }
}

export default AddPartForm;