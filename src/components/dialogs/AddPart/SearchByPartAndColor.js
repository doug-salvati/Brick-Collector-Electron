import React from 'react';
import Rebrickable from '../../../util/rebrickable';

const SearchByElement = props => {
    return (
        <div>
            <form onSubmit={event => {
                event.preventDefault();
                props.onSubmit();
                const partNum = document.querySelector('#part-search-part').value;
                const color = document.querySelector('#part-search-color').value;
                Rebrickable.searchPartWithColor(
                    partNum, color,
                    {
                        success: props.onSuccess,
                        error: props.onFailure
                    }
                );
            }}>
                <input
                    id='part-search-part'
                    className='basic-text-input bootstrap-5 center'
                    type='text'
                    placeholder={'Part #'}
                />
                <input
                    id='part-search-color'
                    className='basic-text-input bootstrap-5 center'
                    type='text'
                    placeholder={'Color'}
                />
                <button
                    id='part-search-go'
                    className='bootstrap-2'
                >
                    Go
                </button>
            </form>
        </div>
    );
}

export default SearchByElement;