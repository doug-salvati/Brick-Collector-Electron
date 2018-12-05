import React from 'react';
import Rebrickable from '../../../util/rebrickable';

const SearchByElement = props => {
    const ph = "Enter a LEGO element ID number, e.g. 4656783";
    return (
        <div>
            <form onSubmit={event => {
                event.preventDefault();
                props.onSubmit();
                const eltNum = document.querySelector('#part-search').value;
                Rebrickable.searchPart(
                    eltNum,
                    {
                        success: props.onSuccess,
                        error: props.onFailure
                    }
                );
            }}>
                <input
                    className='basic-text-input bootstrap-10 center'
                    id='part-search'
                    type='text'
                    placeholder={ph}
                />
                <button
                    className='bootstrap-2 no-margin'
                    type='submit'
                >
                    Go
                </button>
            </form>
        </div>
    );
}

export default SearchByElement;
