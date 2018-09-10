import React, { Component } from 'react';
import {ipcRenderer} from 'electron';
import ThemeImages from '../../../data/themeimages';
import './SetFeature.css';

class SetFeature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formIsGood: false,
            formValue: this.props.item.quantity,
            quantity: this.props.item.quantity
        };
    }
   /* handleChange = (event) => {
        const value = parseInt(document.getElementById('set-feature-input').value);
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
    } */
    render() {
        let set = this.props.item;
        let image = 'assets/set_images/no_img.png';
        // Check if image is hosted locally
        if (part.img) {
            image = (part.img.includes('http')) ? part.img : `assets/set_images/sets/${part.img}`;
        }
        let theme_image = ThemeImages[set.theme]
            ? `assets/set_images/themes/${ThemeImages[set.theme]}`
            : 'assets/set_images/themes/no_theme.png';
        return (
            <div>
                <button id='set-feature-back' onClick={this.props.handleBack}>⬅️</button>
                <div className='set-feature-header'>
                    <b id='set-feature-number'>{set.s_id}</b>
                    <br/>{set.title}<br/>
                    <i className='set-feature-elt-cnt'>{set.part_count} pcs</i>
                    <div className='set-feature-theme-icon'><br/>
                        <img title={set.theme} alt={set.theme} src={theme_image} />
                        <span>{set.theme}</span>
                    </div>
                </div>
                <img className='set-feature-img' src={image} 
                    title={'Image of ' + (set.title ? set.title : 'Unnamed Set')}
                    alt={'Image of ' + (set.title ? set.title : 'No Name')}
                />
            </div>
        )
    }
}

export default SetFeature;