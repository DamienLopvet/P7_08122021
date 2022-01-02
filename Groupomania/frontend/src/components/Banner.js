import logo from "../assets/logo.png";
import '../styles/Banner.css'

function Banner() {
  return <div className="Banner">
      <header className="header">
        <div className="header_brand">
        <img src={logo} className="header_logo" alt="logo Groupomania" />
        <h1>Groupomania</h1>
        </div>
        <div className="header_nav">
        <a
          className="header_nav_link"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Se connecter
        </a>
        <a
          className="header_nav_link"
          href="Signup.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          Creer un compte
        </a>
        </div>
      </header>
    </div>;

}

export default Banner;
