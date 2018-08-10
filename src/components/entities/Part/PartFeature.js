import React, { Component } from 'react';
import ColorHex from '../../../data/colors.js';
import './Part.css';

class PartFeature extends Component {
    constructor(props) {
        super(props);
        this.state = {formIsGood: false, formValue: this.props.part.quantity};
    }
    handleChange = (event) => {
        const value = parseInt(document.getElementById('part-feature-input').value);
        this.setState({formIsGood: (value && !isNaN(value) &&
            value !== this.props.part.quantity && value > 0), formValue: value});
    }
    render() {
        let part = this.props.part;
        let image = 'assets/part_images/no_img.png';
        // Check if image is hosted locally
        if (part.img) {
            image = (part.img.includes('http')) ? part.img : `assets/part_images/elements/${part.img}`;
        }
        const save = this.state.formIsGood ?
            <button id='part-feature-save' onClick={() => this.props.handleSave(this.state.formValue)}>Save Changes</button>
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
                <button id='part-feature-delete' onClick={this.props.handleDelete}>Delete All</button>
                {save}
            </div>
        )
    }
}

export default PartFeature;