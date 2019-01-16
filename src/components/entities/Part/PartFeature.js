import React, { Component } from 'react';
import {ipcRenderer} from 'electron';
import ColorHex from '../../../data/colors.js';
import Set from '../Set/Set';
import Gallery from '../../common/Gallery';
import './PartFeature.css';

class PartFeature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formIsGood: false,
            formValue: this.props.item.quantity,
            quantity: this.props.item.quantity,
            sets: [],
            loading: true,
        };
    }
    componentDidMount() {
        ipcRenderer.send('getSetsContainingPart', this.props.item.p_id);
        ipcRenderer.on('setsSent', (e, r) => {
            this.setState({sets: r, loading: false});
        });
        this.updateWindowDimensions();
        window.addEventListener('resize', () => this.updateWindowDimensions());
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners('setsSent');
        window.removeEventListener('resize', () => this.updateWindowDimensions());
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    handleChange = (event) => {
        const value = parseInt(document.getElementById('part-feature-input').value);
        this.setState({formIsGood: (value && !isNaN(value) &&
            value !== this.state.quantity && value > 0), formValue: value});
    }
    handleSave = () => {
        this.setState({formIsGood: false, quantity: this.state.formValue});
        let copy = Object.assign({}, this.props.item);
        ipcRenderer.send('changePartQuantity', copy, this.state.formValue - this.state.quantity);
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
        let setcount = this.state.sets.length;
        let { loose } = this.props.item;
        let fromSets = this.props.item.quantity - loose;
        let prefixes = this.state.sets.map(set => `${set.quantity}x in `);
        if (this.state.sets.length && this.state.sets.reduce((total, current) => total + current.quantity, 0) + loose !== part.quantity) {
            alert('Something may be wrong with this entry');
        }
        let image = 'assets/part_images/elements/no_img.png';
        // Check if image is hosted locally
        if (part.img) {
            image = (part.img.includes('http')) ? part.img : `assets/part_images/elements/${part.img}`;
        }
        const save = this.state.formIsGood ?
            <button id='part-feature-save' className='bottom-layer' onClick={() => this.handleSave()}>Save Changes</button>
            : '';
        return (
            <div>
                <div className="left">
                    <button className='top-left blank-button' onClick={() => this.props.handleBack(this.state.formIsGood)}>
                        <img className='img-full' src={`assets/ui_icons/${this.state.formIsGood ? 'back-unsaved' : 'back'}.svg`} />
                    </button>
                    <div className='lg-margin'>
                        <input
                        id='part-feature-input' type='number' dir='rtl' onKeyDown={(e) => e.preventDefault()}
                        defaultValue={part.quantity} min={fromSets} onChange={this.handleChange}
                        />
                        <br/>{part.title}<br/>
                        <i className='subtitle'>Element #{part.p_id}</i>
                        <br/>
                        <span className='part-feature-color-circle'
                            style={{background: (part.color ? ColorHex[part.color] : 'rgba(0,0,0,0)')}}
                            title={part.color ? part.color : 'Color Unknown'} />
                        <span> {part.color}</span>
                    </div>
                    <img className='bottom-left lg-margin img-quarter' src={image} 
                        title={'Image of ' + (part.title ? part.title : 'Unnamed Part')}
                        alt={'Image of ' + (part.title ? part.title : 'No Name')}
                    />
                    <button className="bottom-left blank-button sm-margin no-padding trash" onClick={this.handleDelete}></button>
                    {save}
                </div>
                <div className="right">
                    <div className="ten-pct">
                        <div className="fill-height localize">
                            <div className="fill-width no-margin bottom center" >
                                <b>{fromSets}x</b> from {setcount} set{setcount > 1 && 's'}<br/>
                                <b>{this.props.item.loose}x</b> loose
                            </div>    
                        </div>
                        <Gallery
                        Entity={Set}
                        values={this.state.sets}
                        classificationType='theme'
                        width={this.state.width / 2}
                        height={this.state.height * 0.9}
                        prefixes={prefixes}
                        loading={this.state.loading}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default PartFeature;