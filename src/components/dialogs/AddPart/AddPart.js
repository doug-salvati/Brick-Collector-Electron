import React, { Component } from 'react';
import Part from '../../Part/Part';
import './AddPart.css';
import fire from '../../../util/event';

// Modal dialog for adding a single part to inventory
class AddPart extends Component {
    constructor(props) {
        super(props);
        this.state = {part: 'initial'};
    }

    // Performs API request to Rebrickable (may make separate file for API someday)
    searchPart(part_num) {
        let url = 'https://rebrickable.com/api/v3/lego/elements/' + part_num;
        let key = global.rebrickable;
        let request = url + '?key=' + key;
        fetch(request).then(res => res.json()).then(
            (result) => {
                if (result.part) {
                    console.log(result);
                    let new_part = {
                        p_id: result.part.part_num,
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
            },
            (error) => {
                console.log(error);
                this.setState({part: 'none'});
            }
        );
    }

    close = () => {
        fire('partAdded');
        current_window.close();
    }

    handleSubmit = () => {
        global.connection.addPart(this.state.part, () => this.close());
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
        const ph = "Enter a LEGO element ID number, e.g. 4533122"
        return (
            <div>
                <input id='part-search' type='text' placeholder={ph}/><button id='part-search-go' onClick={() => this.searchPart(document.getElementById('part-search').value)}>Go</button><br/>
                <div id='searched-part'>{contents}</div>
                <button id='part-add-cancel' onClick={() => current_window.close()}>Cancel</button>
                <button id='part-add-done' onClick={this.handleSubmit}>Done</button>
            </div>
        );
    }
}

export default AddPart;