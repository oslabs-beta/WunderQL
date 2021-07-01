import { Link } from 'react-router-dom';

const NavBar = () => {
  return(
    <div id='nav-bar'>
      <nav>
          <ul id='nav-list'>
            <li className='nav-list-item'>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className='nav-list-item'>
              <Link to="/testquery">Test Query</Link>
            </li>
            <li className='nav-list-item'>
              <Link to="/playground">Playground</Link>
            </li>
          </ul>
        </nav>
    </div>
  )
}

export default NavBar;