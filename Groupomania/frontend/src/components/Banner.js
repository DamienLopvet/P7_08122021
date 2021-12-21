import logo from "../assets/logo.png";
import '../styles/Banner.css'

function Banner() {
  return <div className="Banner">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo Groupomania" />
        <h1>Groupomania</h1>
        <div className="nav">
        <a
          className="App-link"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Se connecter
        </a>
        <a
          className="App-link"
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
