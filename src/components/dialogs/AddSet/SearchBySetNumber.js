import React from 'react';
import Rebrickable from '../../../util/rebrickable';

const SearchBySetNumber = props => {
    const ph = "Enter a LEGO set number, e.g. 70818";
    const options = Array.from(Array(23)).map((_, idx) => <option key={idx}>{`-${idx + 2}`}</option>);
    return (
        <div>
            <form onSubmit={event => {
                event.preventDefault();
                props.onSubmit();
                const number = document.getElementById('set-search').value;
                const suffix = document.getElementById('set-suffix').value;
                const query = `${number}${suffix === "No Suffix" ? '' : suffix}`
                Rebrickable.searchSet(
                    query,
                    {
                        success: props.onSuccess,
                        error: props.onFailure
                    }
                );
            }}>
                <input
                    className='basic-text-input bootstrap-8 center'
                    id='set-search'
                    type='text'
                    placeholder={ph}
                />
                <select
                    className='bootstrap-2 no-margin'
                    id='set-suffix'
                    defaultValue='-1'
                >
                    <option>No Suffix</option>
                    <option>-1</option>
                    {options}
                </select>
                <button
                    className='bootstrap-2 no-margin'
                    type="submit"
                >
                    Go
                </button>
            </form>
        </div>
    )
}

export default SearchBySetNumber;
