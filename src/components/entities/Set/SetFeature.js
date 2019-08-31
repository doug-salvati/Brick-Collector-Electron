import React, { Component } from 'react';
import {ipcRenderer, shell} from 'electron';
import ThemeImages from '../../../constants/themeimages';
import Part from '../Part/Part';
import Gallery from '../../common/Gallery';
import './SetFeature.css';

class SetFeature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formIsGood: false,
            formValue: this.props.item.quantity,
            quantity: this.props.item.quantity,
            parts: [],
            loading: true,
        };
    }
    componentDidMount() {
        ipcRenderer.send('getPartsInSet', this.props.item.s_id);
        ipcRenderer.on('partsSent', (e, r) => {
            this.setState({parts: r, loading: false});
        });
        ipcRenderer.on('increaseQuantity', () => {
            document.getElementById('set-feature-input').stepUp();
            this.handleChange();
        });
        ipcRenderer.on('decreaseQuantity', () => {
            document.getElementById('set-feature-input').stepDown();
            this.handleChange();
        });
        ipcRenderer.on('openExternalSite', (e, r) => this.openExternalSite(r));
        this.updateWindowDimensions();
        window.addEventListener('resize', () => this.updateWindowDimensions());
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners('partsSent');
        ipcRenderer.removeAllListeners('increaseQuantity');
        ipcRenderer.removeAllListeners('decreaseQuantity');
        ipcRenderer.removeAllListeners('openExternalSite');
        window.removeEventListener('resize', () => this.updateWindowDimensions());
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    handleChange = (event) => {
        const value = parseInt(document.getElementById('set-feature-input').value);
        this.setState({formIsGood: (value && !isNaN(value) &&
            value !== this.state.quantity && value > 0), formValue: value});
    }
    handleSave = () => {
        this.setState({formIsGood: false, quantity: this.state.formValue});
        let copy = Object.assign({}, this.props.item);
        ipcRenderer.send('changeSetQuantity', copy, this.state.formValue - this.state.quantity);
    }
    handleDelete = () => {
        const warning = `Really delete ${this.props.item.title}? This cannot be undone.`
        if (confirm(warning)) {
            ipcRenderer.send('deleteSet', this.props.item);
            this.props.handleBack();
        }
    }
    openExternalSite = (site) => {
        switch (site) {
            case 'rebrickable':
                shell.openExternal(`https://rebrickable.com/sets/${this.props.item.s_id}`);
                break;
            case 'bricklink':
                shell.openExternal(`https://www.bricklink.com/v2/catalog/catalogitem.page?S=${this.props.item.s_id}`);
                break;
            case 'instructions':
                shell.openExternal(`https://www.lego.com/en-us/service/buildinginstructions/search#?search&text=${this.props.item.s_id.split('-')[0]}`);
                break;
        }
    }
    render() {
        let set = this.props.item;
        let image = 'assets/set_images/no_img.png';
        // Check if image is hosted locally
        if (set.img) {
            image = (set.img.includes('http')) ? set.img : `/Library/Application Support/com.dsalvati.brickcollector/set_images/${set.img}`;
        }
        let theme_image = ThemeImages[set.theme]
            ? `assets/${ThemeImages[set.theme]}`
            : 'assets/set_images/themes/no_theme.png';
        const save = this.state.formIsGood ?
            <button id='set-feature-save' className='bottom-layer' onClick={() => this.handleSave()}>Save Changes</button>
            : '';
        return (
            <div>
                <div className='left'>
                    <button className='top-left blank-button' onClick={() => this.props.handleBack(false)}>
                    <img className='img-full' src='assets/ui/back.svg' />
                    </button>
                    <div className='lg-margin'>
                        <input
                            id='set-feature-input' type='number' dir='rtl' onKeyDown={(e) => e.preventDefault()}
                            defaultValue={set.quantity} min={1} onChange={this.handleChange}
                        />
                        <br/><b id='set-feature-number'>{set.s_id.split('-')[0]}</b>
                        <br/>{set.title}<br/>
                        <i className='subtitle'>{set.part_count} pcs</i>
                        <span className='set-feature-theme' ><br/>
                            <img className='set-feature-theme-icon' title={set.theme} alt={set.theme} src={theme_image} />
                        </span><span>{set.theme}</span>
                    </div>
                    <img className='bottom-left lg-margin img-quarter' src={image} 
                        title={'Image of ' + (set.title ? set.title : 'Unnamed Set')}
                        alt={'Image of ' + (set.title ? set.title : 'No Name')}
                    />
                    <button className="bottom-left blank-button sm-margin no-padding trash" onClick={this.handleDelete}></button>
                    {save}
                </div>
                <div className='right'>
                    <div className="ten-pct">
                        <div className="fill-height localize">
                            <div className="fill-width no-margin bottom center">Contains {this.state.parts.length} parts.</div>
                        </div>
                        <Gallery
                            Entity={Part}
                            values={this.state.parts}
                            classificationType='color'
                            width={this.state.width / 2}
                            height={this.state.height * 0.9}
                            loading={this.state.loading}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default SetFeature;