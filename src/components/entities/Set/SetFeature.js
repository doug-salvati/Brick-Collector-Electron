import React, { Component } from 'react';
import {ipcRenderer} from 'electron';
import ThemeImages from '../../../data/themeimages';
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
        this.updateWindowDimensions();
        window.addEventListener('resize', () => this.updateWindowDimensions());
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners('partsSent');
        window.removeEventListener('resize', () => this.updateWindowDimensions());
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
   /*
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
        if (set.img) {
            image = (set.img.includes('http')) ? set.img : `assets/set_images/sets/${set.img}`;
        }
        let theme_image = ThemeImages[set.theme]
            ? `assets/${ThemeImages[set.theme]}`
            : 'assets/set_images/themes/no_theme.png';
        return (
            <div>
                <div className='left'>
                    <button className='top-left blank-button' onClick={this.props.handleBack}>
                    <img className='img-full' src={`assets/ui_icons/${this.state.formIsGood ? 'back-unsaved' : 'back'}.svg`} />
                    </button>
                    <div className='lg-margin'>
                        <b id='set-feature-number'>{set.s_id.split('-')[0]}</b>
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