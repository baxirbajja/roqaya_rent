import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="why-section">
        <h1>Why <strong>SAFERENT</strong></h1>
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card p-3">
                <div className="card-body">
                  <h5 className="card-title">Soyez malin</h5>
                  <p className="card-text">mettez en location les biens qui dorment chez vous !</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3">
                <div className="card-body">
                  <h5 className="card-title">économisez de l'argent</h5>
                  <p className="card-text">en louant ce dont vous avez besoin, juste quand vous en avez besoin !</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3">
                <div className="card-body">
                  <h5 className="card-title">Louer au lieu d'acheter</h5>
                  <p className="card-text">c'est consommer autrement et faire de nouvelles rencontres dans votre quartier !</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-us-section">
        <h1>About us</h1>
        <div className="container mt-5">
          <div className="info-box">
            <p>
              <strong>SAFERENT</strong> Bienvenue sur notre plateforme de location,
              une application web intuitive permettant aux utilisateurs de publier et de gérer
              leurs annonces de location en toute simplicité. Que vous soyez un particulier cherchant un
              logement temporaire ou un propriétaire souhaitant louer un bien, notre plateforme offre
              une solution efficace et sécurisée.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
