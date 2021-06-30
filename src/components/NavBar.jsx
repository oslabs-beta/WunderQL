import { Link } from 'react-router-dom';

const NavBar = () => {
  return(
    <div id='nav-bar'>
      <nav>
          <ul id='nav-list'>
            <li class='nav-list-item'>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li class='nav-list-item'>
              <Link to="/testquery">Test Query</Link>
            </li>
            <li class='nav-list-item'>
              <Link to="/playground">Playground</Link>
            </li>
          </ul>
        </nav>
    </div>
  )
}

export default NavBar;