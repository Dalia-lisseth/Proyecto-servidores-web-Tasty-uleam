import { useNavigate } from 'react-router-dom';
import Header from '../componets/Header';
import tastyCentralImg from '../assets/Tastycentral.jpg';
import tastyExpressImg from '../assets/tastyexpress.jpg';
import tastyComedorImg from '../assets/Tastycomedor.jpg';
import postresImg from '../assets/postres.jpg';
import bebidasImg from '../assets/bebidas.jpg';
import '../styles/tasty.css';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <section className="hero-banner">
        <div className="banner-container">
          <img src={tastyCentralImg} alt="Banner Comida" className="banner-img" />
          <div className="hero-overlay">
            <div className="hero-content">
              <span className="eyebrow">CAFETERIAS ULEAM</span>
              <h1>Sabores que <em>inspiran</em></h1>
              <p>Descubre, elige y disfruta de tus platos favoritos en nuestras sedes universitarias.</p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => navigate('/sede/tasty-central')}>Explorar menú <span>→</span></button>
                <button className="btn-outline" onClick={() => document.getElementById('sedes')?.scrollIntoView({ behavior: 'smooth' })}>Ver sedes <span>⌄</span></button>
              </div>
              <div className="hero-stats">
                <div className="stat-item"><strong>⌖</strong><span className="stat-number">3</span><span className="stat-label">Sedes</span></div>
                <div className="stat-item"><strong>♨</strong><span className="stat-number">60+</span><span className="stat-label">Platos</span></div>
                <div className="stat-item"><strong>◷</strong><span className="stat-number">24/7</span><span className="stat-label">Disponible</span></div>
              </div>
            </div>
            <span className="hero-note">Buen café,<br /><em>mejores momentos</em> ♡</span>
          </div>
        </div>
      </section>

      <main className="content">
        <div className="container home-content">
          <section className="locations-section" id="sedes">
            <div className="section-heading"><div><span className="section-kicker">ENCUENTRA TU LUGAR</span><h2 className="section-title">Nuestras sedes</h2><p>Elige la más cercana y disfruta de nuestros deliciosos platillos.</p></div><span className="section-link">Ver todas las sedes →</span></div>
            <div className="sucursales-container">
              <article className="card card-clickable" onClick={() => navigate('/sede/tasty-central')}><img src={tastyCentralImg} alt="Tasty Central" /><div className="card-overlay"><h3>Tasty Central</h3><p>☕ Café | ♨ Postres | ✦ Snacks</p><span>Ver menú →</span></div></article>
              <article className="card card-clickable" onClick={() => navigate('/sede/tasty-express')}><img src={tastyExpressImg} alt="Tasty Express" /><div className="card-overlay"><h3>Tasty Express</h3><p>▣ Hamburguesas | ✦ Snacks | ♨ Bebidas</p><span>Ver menú →</span></div></article>
              <article className="card card-clickable" onClick={() => navigate('/sede/tasty-comedor')}><img src={tastyComedorImg} alt="Tasty Comedor" /><div className="card-overlay"><h3>Tasty Comedor</h3><p>▤ Platos fuertes | ✦ Ensaladas</p><span>Ver menú →</span></div></article>
            </div>
          </section>

          <section className="how-section">
            <div className="how-intro"><h2>¿Cómo<br /><em>funciona?</em></h2><p>Es muy fácil, sigue estos pasos y disfruta de tu pedido.</p></div>
            <div className="how-it-works">
              <div className="step-item"><span className="step-number">01</span><div className="step-content"><h4>Elige tu sede</h4><p>Selecciona la cafetería más cercana a ti.</p></div><b>→</b></div>
              <div className="step-item"><span className="step-number">02</span><div className="step-content"><h4>Explora el menú</h4><p>Conoce todas nuestras opciones deliciosas.</p></div><b>→</b></div>
              <div className="step-item"><span className="step-number">03</span><div className="step-content"><h4>Realiza tu pedido</h4><p>Reserva una mesa o haz tu pedido.</p></div></div>
            </div>
          </section>

          <section className="menu-preview">
            <div className="menu-intro"><span className="section-kicker">PARA CADA ANTOJO</span><h2 className="section-title">Explora nuestro menú</h2><p>Desde un buen café hasta platos completos, tenemos algo para cada momento.</p><button className="btn-primary" onClick={() => navigate('/sede/tasty-central')}>Ver menú completo →</button></div>
            <div className="menu-tiles"><button onClick={() => navigate('/sede/tasty-central')}><img src={tastyCentralImg} alt="Café" /><span>☕ Café</span></button><button onClick={() => navigate('/sede/tasty-express')}><img src={tastyExpressImg} alt="Comidas" /><span>▣ Comidas</span></button><button onClick={() => navigate('/sede/tasty-comedor')}><img src={postresImg} alt="Postres" /><span>♨ Postres</span></button><button onClick={() => navigate('/sede/tasty-central')}><img src={bebidasImg} alt="Bebidas" /><span>♧ Bebidas</span></button></div>
          </section>
        </div>
      </main>
      <footer className="site-footer"><div className="container"><div className="footer-brand"><strong>♨ Tasty <em>Uleam</em></strong><small>Comida que te acompaña</small></div><small>Universidad Laica Eloy Alfaro de Manabí<br />© 2025 Tasty Uleam. Todos los derechos reservados.</small><div className="footer-social">◎ f ♪</div></div></footer>
    </>
  );
}
