import React, { Component } from 'react';
import Part from '../../Part/Part';
import './AddPart.css';
import {ipcRenderer} from 'electron';
import Rebrickable from '../../../util/rebrickable';

// Modal dialog for adding a single part to inventory
class AddPart extends Component {
    constructor(props) {
        super(props);
        this.state = {part: 'initial'};
    }

    searchPart(part_num) {
        let success_callback = (result) => {
            console.log(result);
            if (result.part) {
                let new_part = {
                    p_id: result.element_id,
                    title: result.part.name,
                    color: result.color.name,
                    img: result.element_img_url,
                    quantity: 1,
                    loose: 1
                };
                this.setState({part: new_part});
            } else {
                this.setState({part: 'none'});
            }
        }
        Rebrickable.searchPart(part_num, global.rebrickable, {success: success_callback, error: alert});
    }

    handleSubmit = () => {
        ipcRenderer.send('addPart', Object.assign({}, this.state.part));
        current_window.close();
    }

    render() {
        var part = this.state.part;
        var contents = <p></p>;
        switch (part) {
            case 'initial':
                contents = <p className='contents'>Please search a part number above.</p>; break;
            case 'none':
                contents = <p className='contents'>No results found.</p>; break;
            default:
                contents = <Part name={part.title} color={part.color} qty={part.quantity} image={part.img} />;
        }
        const ph = "Enter a LEGO element ID number, e.g. 4656783"
        return (
            <div>
                <input id='part-search' type='text' placeholder={ph}/><button id='part-search-go' onClick={() => this.searchPart(document.getElementById('part-search').value)}>Go</button><br/>
                <div id='searched-part'>{contents}</div>
                <button id='part-add-cancel' onClick={() => current_window.close()}>Cancel</button>
                {this.state.part !== 'initial' && this.state.part !== 'none' ?
                    <button id='part-add-done' onClick={this.handleSubmit}>Add this Part</button> : ''}
            </div>
        );
    }
}

export default AddPart;