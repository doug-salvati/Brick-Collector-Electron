import React, { Component } from 'react';
import {ipcRenderer, remote} from 'electron';
import Gallery from '../../common/Gallery';
import {registerActions, removeActions} from '../../../util/registerActions';
import './EntityFeature.css';

class EntityFeature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formIsGood: false,
            formValue: this.props.item.quantity,
            quantity: this.props.item.quantity,
            entities: [],
            loading: true,
        };
        this.handleKeypress = this.handleKeypress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this)
        this.handleDelete = this.handleDelete.bind(this);
    }
    componentDidMount() {
        console.log(`fetch relations to item with ID ${this.props.item.id}`, this.props.item);
        this.props.fetcher(this.props.item.id);
        registerActions(ipcRenderer, this.props.actions, this);
        ipcRenderer.on('increaseQuantity', () => {
            document.getElementById('entity-feature-input').stepUp();
            this.handleChange();
        });
        ipcRenderer.on('decreaseQuantity', () => {
            document.getElementById('entity-feature-input').stepDown();
            this.handleChange();
        });
        this.updateWindowDimensions();
        window.addEventListener('resize', () => this.updateWindowDimensions());
        window.addEventListener('keydown', this.handleKeypress);
    }
    componentWillUnmount() {
        removeActions(ipcRenderer, this.props.actions);
        ipcRenderer.removeAllListeners('increaseQuantity');
        ipcRenderer.removeAllListeners('decreaseQuantity');
        window.removeEventListener('resize', () => this.updateWindowDimensions());
        window.removeEventListener('keydown', this.handleKeypress);
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    handleKeypress(event) {
        switch(event.keyCode) {
            case 8:
                this.props.handleBack(this.state.formIsGood);
                break;
            case 13:
                if (this.state.formIsGood) this.handleSave();
                break;
            case 46:
                this.handleDelete();
                break;
        }
    }
    handleChange(event) {
        const value = parseInt(document.getElementById('entity-feature-input').value);
        this.setState({formIsGood: (value && !isNaN(value) &&
            value !== this.state.quantity && value > 0), formValue: value});
    }
    handleSave() {
        let copy = Object.assign({}, this.props.item);
        ipcRenderer.send(this.props.updateAction, copy, this.state.formValue - this.state.quantity);
        this.setState({formIsGood: false, quantity: this.state.formValue});
    }
    handleDelete() {
        const q = this.state.quantity;
        const deletion_quantity = q === 1 ? 'your' : q === 2 ? 'both' : `all ${q}`
        const warning = `Really delete ${deletion_quantity} ${this.props.item.title}? This cannot be undone.`
        if (remote.dialog.showMessageBoxSync({
            type: "question",
            buttons: ["Cancel", "OK"],
            defaultId: 1,
            message: warning,
        })) {
            ipcRenderer.send(this.props.deleteAction, this.props.item);
            this.props.handleBack();
        }
    }
    render() {
        let entity = this.props.item;
        let imgDir = this.props.imgDir;
        const prefixes = this.props.getPrefixes ? this.props.getPrefixes(this.state.entities) : [];
        // Check if image is hosted locally
        const image = (entity.img.includes('http')) ? entity.img : `/Library/Application Support/com.dsalvati.brickcollector/${imgDir}/${entity.img}`;
        const save = this.state.formIsGood ?
            <button id='entity-feature-save' className='bottom-layer' onClick={() => this.handleSave()}>Save Changes</button>
            : '';
        return (
            <div>
                <div className="left">
                    <button className='top-left blank-button' onClick={() => this.props.handleBack(this.state.formIsGood)}>
                        <img className='img-full' src={`assets/ui/${this.state.formIsGood ? 'back-unsaved' : 'back'}.svg`} />
                    </button>
                    <div className='lg-margin'>
                        <input
                            id='entity-feature-input' type='number' dir='rtl' onKeyDown={(e) => e.preventDefault()}
                            defaultValue={entity.quantity} min={this.props.min} onChange={this.handleChange}
                        />
                        <br/>{entity.title}<br/>
                        <i className='subtitle'>{this.props.subtitle}</i>
                        <br/>
                        {this.props.bubble}
                    <span>{this.props.item[this.props.classificationType]}</span>
                    </div>
                    <img className='bottom-left lg-margin img-quarter' src={image} 
                        title={'Image of ' + (entity.title ? entity.title : 'Unnamed')}
                        alt={'Image of ' + (entity.title ? entity.title : 'No Name')}
                    />
                    <button className="bottom-left blank-button sm-margin no-padding trash" onClick={this.handleDelete}></button>
                    {save}
                </div>
                <div className="right">
                    <div className="ten-pct">
                        <div className="fill-height localize">
                            <div className="fill-width no-margin bottom center" >
                                <this.props.Detail item={this.props.item} count={this.state.entities.length} />
                            </div>
                        </div>
                        <Gallery
                            Entity={this.props.Entity}
                            values={this.state.entities}
                            classificationType={this.props.entityClassificationType}
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

export default EntityFeature;