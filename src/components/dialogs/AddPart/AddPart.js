import React, { Component } from 'react';
import Part from '../../entities/Part/Part';
import SearchByElement from './SearchByElement';
import SearchByPartAndColor from './SearchByPartAndColor';
import Loader from '../../common/Loader/Loader';
import './AddPart.css';
import {ipcRenderer} from 'electron';

// Modal dialog for adding a single part to inventory
class AddPart extends Component {
    constructor(props) {
        super(props);
        this.state = {part: 'initial', searchBy: 'element'};
    }

    componentDidMount() {
        document.querySelector('#part-search').focus();
    }
    componentDidUpdate(_, prevState) {
        if (prevState.searchBy !== this.state.searchBy) {
            document.querySelector(
                this.state.searchBy === 'element' ? '#part-search' : '#part-search-part'
            ).focus();
        }
        if (document.querySelector('#part-add-done')) {
            document.querySelector('#part-add-done').focus();
        }
    }

    searchSuccess(result) {
        if (result.part) {
            let new_part = {
                id: result.element_id,
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

    partSearchSuccess(result) {
        console.log(result);
    }

    toggleAdvancedSearch() {
        this.setState(old => ({
            searchBy: old.searchBy === 'element' ? 'part' : 'element'
        }));
    }

    handleSubmit = () => {
        ipcRenderer.send('addPart', Object.assign({}, this.state.part));
        current_window.close();
    }

    render() {
        const { part } = this.state;
        let contents;
        switch (part) {
            case 'initial':
                contents = <p className='contents'>Please search a part number above.</p>; break;
            case 'none':
                contents = <p className='contents'>No results found.</p>; break;
            case 'loading':
                contents = <Loader />; break;
            default:
                contents = <Part name={part.title} classification={part.color} qty={part.quantity} image={part.img} />;
        }
        const searchBar = this.state.searchBy === 'element'
            ?
                <SearchByElement
                    onSubmit={() => this.setState({part: 'loading'})}
                    onSuccess={res => this.searchSuccess(res)}
                    onFailure={alert}
                />
            :
                <SearchByPartAndColor
                    onSubmit={() => this.setState({part: 'loading'})}
                    onSuccess={res => this.searchSuccess(res)}
                    onFailure={alert}
                />;

        return (
            <div>
                {searchBar}
                <a className='top-layer' onClick={() => this.toggleAdvancedSearch()} href='#'>
                    {this.state.searchBy === 'element' ? 'Advanced' : 'Standard'}
                </a>
                <div id='searched-part' className='fill-width'>{contents}</div>
                <button id='part-add-cancel' onClick={() => current_window.close()}>Cancel</button>
                {!['initial', 'loading', 'none'].includes(this.state.part) ?
                    <button id='part-add-done' onClick={this.handleSubmit}>Add this Part</button> : ''}
            </div>
        );
    }
}

export default AddPart;