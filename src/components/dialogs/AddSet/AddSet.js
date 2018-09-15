import React, { Component } from 'react';
import Set from '../../entities/Set/Set';
import Part from '../../entities/Part/Part';
import './AddSet.css';
import {ipcRenderer} from 'electron';
import Rebrickable from '../../../util/rebrickable';
import GalleryPicker from '../../common/GalleryPicker';

// Modal dialog for adding a single set to inventory
class AddSet extends Component {
    constructor(props) {
        super(props);
        this.state = {set: 'initial', page: 1, parts: []};
    }

    searchSet(set_num) {
        let success_callback = (result) => {
            if (result.set_num) {
                let new_set = {
                    s_id: result.set_num,
                    title: result.name,
                    theme: result.theme,
                    img: result.set_img_url,
                    quantity: 1,
                };
                this.setState({set: new_set});
            } else {
                this.setState({set: 'none'});
            }
        }
        Rebrickable.searchSet(set_num, global.rebrickable, {success: success_callback, error: alert});
    }

    handleGo = () => {
        const number = document.getElementById('set-search').value;
        const suffix = document.getElementById('set-suffix').value;
        const query = `${number}${suffix === "No Suffix" ? '' : suffix}`
        this.searchSet(query);
    }

    handleNext = () => {
        Rebrickable.getPartsInSet(this.state.set.s_id, global.rebrickable,
            {
                success: results => {
                    const mappedResults = results.map(result => ({
                        title: result.part.name,
                        img: result.part.part_img_url,
                        color: result.color.name,
                        quantity: result.quantity,
                    }));
                    this.setState({parts: mappedResults});
                },
                error: alert
            });
        this.setState({page: 2});
    }

    handleSubmit = () => {
        ipcRenderer.send('addSet', Object.assign({}, this.state.state));
        current_window.close();
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
                default:
                    contents = <Set name={set.title} xid={set.s_id} classification={set.theme} image={set.img} />;
            }
            const ph = "Enter a LEGO set number, e.g. 70818"
            const options = Array.from(Array(23)).map((_, idx) => <option>{`-${idx + 2}`}</option>);
            return (
                <div>
                    <input id='set-search' type='text' placeholder={ph}/>
                    <select id='set-suffix' selected='-1'>
                        <option>No Suffix</option>
                        <option selected>-1</option>
                        {options}
                    </select>
                    <button id='set-search-go' onClick={this.handleGo}>Go</button><br/>
                    <div id='searched-set'>{contents}</div>
                    <button id='set-add-cancel' onClick={() => current_window.close()}>Cancel</button>
                    {set !== 'initial' && set !== 'none' ?
                        <button id='set-add-done' onClick={() => this.handleNext()}>Next</button> : ''}
                </div>
            );
        } else {
            console.log(this.state.parts);
            return (
                <div>
                    <GalleryPicker Entity={Part} values={this.state.parts} classificationType='color'/>
                    <button id='set-add-cancel' onClick={() => this.setState({page: 1})}>Back</button>
                </div>
            );
        }
    }
}

export default AddSet;