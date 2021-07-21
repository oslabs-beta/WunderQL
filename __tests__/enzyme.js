import React from 'react';
import { shallow } from 'enzyme';
import App from '../src/App'
import Login from '../src/components/Login'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import logo from '../public/assets/logo-small.png'


describe('React unit tests', () => {
  describe('Login Component', () => {
    let wrapper;
    const props = {
      label: 'Mega',
      text: 'Markets',
    };

    beforeAll(() => {
      wrapper = shallow(<Login />);
      // wrapper = shallow(<Login {...props} />);
    });

    it('Displays the company logo', () => {
      expect(wrapper.type()).toEqual('div');
      expect(wrapper.exists('img')).toEqual('img');
    });
    it('Renders a form tag with 2 inputs', () => {
      expect(wrapper.type()).toEqual('p');
      expect(wrapper.text()).toEqual('Mega: Markets');
      expect(wrapper.find('strong').text()).toMatch('Mega');
    });
    it('Renders a <p> tag with the label in bold', () => {
      expect(wrapper.type()).toEqual('p');
      expect(wrapper.text()).toEqual('Mega: Markets');
      expect(wrapper.find('strong').text()).toMatch('Mega');
    });
  });

  describe('MarketDisplay', () => {
    // TODO: Test the following:
    // 1. A MarketDisplay should display all of its text props inside a
    // LabeledText component
    // 2. It should also contain a div with two buttons
    // 3. The functions passed down should be invoked on click
    // 4. MarketDisplay should render a div with a class of `marketBox`, and the
    // interior div wrapping the two buttons should have a class of `flex`

  });

  describe('MarketsDisplay', () => {
    // TODO: Test the following:
    //   1. A MarketsDisplay should have an h4 element to display the 'Markets'
    //   title
    //   2. A single MarketDisplay is rendered for each market in the
    //   marketList prop
    //   3. The percentage prop should be a string calculated to two decimals.
    //   Test for zero, a whole number, and a fractional value. (Right now this
    //   is implemented incorrectly, so follow TDD here)
  });
});
