import React, { Component } from 'react';
import Set from '../../entities/Set/Set';
import Part from '../../entities/Part/Part';
import './AddSet.css';
import {ipcRenderer} from 'electron';
import Rebrickable from '../../../util/rebrickable';
import Gallery from '../../common/Gallery';
import SearchBySetNumber from './SearchBySetNumber';
import Loader from '../../common/Loader/Loader';

// Modal dialog for adding a single set to inventory
class AddSet extends Component {
    constructor(props) {
        super(props);
        this.state = {set: 'initial', page: 1, parts: [], count: 0};
        this.handleSelect = this.handleSelect.bind(this);
        this.searchSuccess = this.handleSelect.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitLoose = this.handleSubmitLoose.bind(this);
    }

    componentDidMount() {
        document.querySelector('#set-search').focus();
    }

    componentDidUpdate() {
        if (document.querySelector('#set-add-done')) {
            document.querySelector('#set-add-done').focus();
        }
    }

    searchSuccess(result) {
        if (result.set_num) {
            let new_set = {
                id: result.set_num,
                title: result.name,
                part_count: result.num_parts,
                theme: result.theme,
                img: result.set_img_url,
                quantity: 1,
            };
            this.setState({set: new_set, parts: []});
        } else {
            this.setState({set: 'none'});
        }
    }

    handleNext() {
        Rebrickable.getPartsInSet(this.state.set.id,
            {
                success: results => {
                    results.forEach(result => result.enabled = true);
                    this.setState({parts: results});
                    const count = this.state.parts.reduce((sum, next) => sum + next.quantity, 0);
                    const expectedCount = this.state.set.part_count;
                    if (count !== 0 && count < expectedCount) {
                        alert(`WARNING: This set should contain ${expectedCount} parts, but Rebrickable only reported ${count}!`);
                    }
                    this.setState({count});
                },
                error: alert
            });
        this.setState({page: 2});
    }

    handleSubmit() {
        ipcRenderer.send('addSet', {
            set: this.state.set,
            parts: this.state.parts
        });
        current_window.close();
    }

    handleSubmitLoose() {
        ipcRenderer.send('addParts', this.state.parts.filter(part => part.enabled));
        current_window.close();
    }

    handleSelect(id) {
        const { parts } = this.state;
        const part = parts[parts.findIndex(elt => elt.id === id)];
        part.enabled = !part.enabled;
        const count = parts.reduce((sum, next) => sum + next.quantity * (next.enabled ? 1 : 0), 0);
        this.setState({parts, count});
    }

    render() {
        if (this.state.page === 1) {
            const { set } = this.state;
            let contents = <p></p>;
            switch (set) {
                case 'initial':
                    contents = <p className='contents'>Please search a set number above.</p>; break;
                case 'none':
                    contents = <p className='contents'>No results found.</p>; break;
                case 'loading':
                    contents = <Loader />; break;
                default:
                    contents = <Set name={set.title} xid={set.id} classification={set.theme} image={set.img} />;
            }
                return (
                    <div>
                        <SearchBySetNumber
                            onSubmit={() => this.setState({set: 'loading'})}
                            onSuccess={res => this.searchSuccess(res)}
                            onFailure={alert}
                        />
                        <div id='searched-set' className='fill-width'>{contents}</div>
                        <button id='set-add-cancel' onClick={() => current_window.close()}>Cancel</button>
                        {!['initial', 'loading', 'none'].includes(this.state.set) ?
                            <button id='set-add-done' onClick={() => this.handleNext()}>Next</button> : ''}
                    </div>
            );
        } else {
            return (
                <div>
                    <Gallery
                        Entity={Part}
                        values={this.state.parts}
                        classificationType='color'
                        width={window.innerWidth}
                        height={window.innerHeight}
                        onSelect={this.handleSelect}
                    />
                    <button id='set-add-cancel' className='middle-layer' onClick={() => this.setState({page: 1})}>Back</button>
                    <button id='set-add-done' className='middle-layer' onClick={() => this.handleSubmit()}>{`Add Set`}</button>
                    <button id='set-add-loose' className='middle-layer' onClick={() => this.handleSubmitLoose()}>{`Add as ${this.state.count} Loose Parts`}</button>
                </div>
            );
        }
    }
}

export default AddSet;