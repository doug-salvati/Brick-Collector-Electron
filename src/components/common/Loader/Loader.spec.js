import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import Loader, { loaders } from './Loader';

describe('loader', () => {
    it('renders a random div', () => {
        const loader = Enzyme.shallow(<Loader />);
        const classNames = loader.find('div').props('className').className;
        expect(classNames).toMatch(/generic.*?(red|green|blue)/);
    });
    it('renders a specific loader', () => {
        const loader = Enzyme.shallow(<Loader variety='blue' />);
        const classNames = loader.find('div').props('className').className;
        expect(classNames).toEqual('generic blue');
    });
});