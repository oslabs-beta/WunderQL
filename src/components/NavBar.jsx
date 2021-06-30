import { Link } from 'react-router-dom';

const NavBar = () => {
  return(
    <div id='nav-bar'>
      hi im a navbar
      <nav>
          <ul id='nav-items'>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/testquery">Test Query</Link>
            </li>
          </ul>
        </nav>
    </div>
  )
}

export default NavBar;