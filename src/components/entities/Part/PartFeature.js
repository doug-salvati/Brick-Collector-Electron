import React, { Component } from 'react';
import {ipcRenderer} from 'electron';
import ColorHex from '../../../data/colors.js';
import './Part.css';

class PartFeature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formIsGood: false,
            formValue: this.props.item.quantity,
            quantity: this.props.item.quantity
        };
    }
    handleChange = (event) => {
        const value = parseInt(document.getElementById('part-feature-input').value);
        this.setState({formIsGood: (value && !isNaN(value) &&
            value !== this.state.quantity && value > 0), formValue: value});
    }
    handleSave = () => {
        this.setState({formIsGood: false, quantity: this.state.formValue});
        let copy = Object.assign({}, this.props.item);
        ipcRenderer.send('changePartQuantity', copy, this.state.formValue);
    }
    handleDelete = () => {
        const q = this.state.quantity;
        const deletion_quantity = q === 1 ? 'your' : q === 2 ? 'both' : `all ${q}`
        const warning = `Really delete ${deletion_quantity} ${this.props.item.title}? This cannot be undone.`
        if (confirm(warning)) {
            ipcRenderer.send('deletePart', this.props.item);
            this.props.handleBack();
        }
    }
    render() {
        let part = this.props.item;
        let image = 'assets/part_images/no_img.png';
        // Check if image is hosted locally
        if (part.img) {
            image = (part.img.includes('http')) ? part.img : `assets/part_images/elements/${part.img}`;
        }
        const save = this.state.formIsGood ?
            <button id='part-feature-save' onClick={() => this.handleSave()}>Save Changes</button>
            : '';
        return (
            <div>
                <button id='part-feature-back' onClick={this.props.handleBack}>⬅️</button>
                <div className='part-feature-header'>
                    <input
                    id='part-feature-input' type='number' dir='rtl' onKeyDown={(e) => e.preventDefault()}
                    defaultValue={part.quantity} min='1' onChange={this.handleChange}
                    />
                    <br/>{part.title}<br/>
                    <i className='part-feature-elt-num'>Element #{part.p_id}</i>
                    <div className='part-feature-color'><br/>
                    <div className='part-feature-color-circle'
                        style={{background: (part.color ? ColorHex[part.color] : 'rgba(0,0,0,0)')}}
                        title={part.color ? part.color : 'Color Unknown'}>
                    </div> <span>{part.color}</span>
                </div>
                </div>
                <img className='part-feature-img' src={image} 
                    title={'Image of ' + (part.title ? part.title : 'Unnamed Part')}
                    alt={'Image of ' + (part.title ? part.title : 'No Name')}
                />
                <button id='part-feature-delete' onClick={this.handleDelete}>Delete All</button>
                {save}
            </div>
        )
    }
}

export default PartFeature;