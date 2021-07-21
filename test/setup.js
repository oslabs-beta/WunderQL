import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// Newer Enzyme versions require an adapter to a particular version of React
Enzyme.configure({ adapter: new Adapter() })