import React, { Component } from 'react';
import Part from '../../Part/Part';
import './AddPart.css';

// Modal dialog for adding a single part to inventory
class AddPart extends Component {
    constructor(props) {
        super(props);
        this.state = {part: 'initial'};
    }

    // Performs API request to Rebrickable (API will be placed elsewhere later)
    searchPart(part_num) {
        let url = 'https://rebrickable.com/api/v3/lego/elements/' + part_num;
        let key = '9892bffffa8224a80e95cbd5394eb95a';
        let request = url + '?key=' + key;
        fetch(request).then(res => res.json()).then(
            (result) => {
                if (result.part) {
                    let new_part = {
                        title: result.part.name,
                        color: result.color.name,
                        img: result.element_img_url
                    };
                    this.setState({part: new_part});
                } else {
                    this.setState({part: 'none'});
                }
            },
            (error) => {
                console.log(error);
                this.setState({part: 'none'});
            }
        );
    }

    render() {
        var part = this.state.part;
        var contents = <p></p>;
        switch (part) {
            case 'initial':
                contents = <p className='contents'>Please search a part number above.</p>; break;
            case 'none':
                contents = <p className='contents'>No results found.</p>; break;
            default:
                contents = <Part name={part.title} color={part.color} qty={part.quantity} image={part.img} />;
        }
        let pc = "Enter a LEGO element ID number, e.g. 4533122"
        return (
            <div>
                <input id='part-search' type='text' placeholder={pc}/><button id='part-search-go' onClick={() => this.searchPart(document.getElementById('part-search').value)}>Go</button><br/>
                <div id='searched-part'>{contents}</div>
                <button id='part-add-cancel' onClick={() => current_window.close()}>Cancel</button><button id='part-add-done'>Done</button>
            </div>
        );
    }
}

export default AddPart;