import React from "react";
import { Link } from "react-router-dom"
import "./index.css";
import ImgHero from "./img/hero.png"
import Logo from "./img/logo.png"
import LogoMini from "./img/logo-mini.png"
import ImgWhy from "./img/img-why.png"

export default function App() {
  return (
    <div className="site-root">
      <header className="site-header">
        <div className="container header-inner">
          <div className="logo">
            <img src={Logo} alt="" />
          </div>
          <nav className="nav">
            <a href="#how">Cómo funciona</a>
            <a href="#rates">Comprar USDT</a>
            <Link to={"/auth"} className="btn btn-primary">Iniciar Sesion</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-left">
              <div className="stats">
                <div className="stat">
                  <div className="stat-label">Transacciones Confiables</div>
                </div>
                <div className="stat">
                  <div className="stat-num">99%</div>
                  <div className="stat-label">Satisfacción</div>
                </div>
                <div className="stat">
                  <div className="stat-num">24/7</div>
                  <div className="stat-label">Soporte</div>
                </div>
              </div>
              <h1>Tu manera fácil y segura de comprar/vender <span>USDT</span> en <span className="bolivia">Bolivia</span></h1>
              <p className="lead">Proceso simple, pagos locales y soporte 24/7. Transacciones instantáneas y sin complicaciones.</p>
              <div className="hero-ctas">
                <Link to={"/auth"} className="btn btn-primary">Comprar ahora</Link>
                <a className="btn btn-ghost" href="#how">Cómo funciona</a>
              </div>

            </div>

            <img src={ImgHero} alt="" />
          </div>
        </section>

        <section id="how" className="how container">
          <h2>Cómo funciona nuestra plataforma</h2>
          <span>Comprar USDT con nosotros es simple, seguro y directo.</span>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Selecciona el monto</h4>
              <p>Dentro de nuestra aplicacion elige cuánto deseas comprar o vender.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Realiza el pago</h4>
              <p>Recibirás los datos para realizar la transferencia o a travez de un QR de pago.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Recibe tu USDT</h4>
              <p>Confirmamos la recepción del dinero en moneda local y enviamos los USDT a tu wallet inmediatamente.</p>
            </div>
          </div>
        </section>

        <div className="why-usdt">
          <div className="content">
            <h2>¿Por Qué Elegirnos?</h2>
            <p>Proporcionamos la experiencia más confiable y segura para comprar USDT en Bolivia.</p>

            <div className="features">
              <div className="feature">
                <span className="icon">
                  <img width="40" height="40" src="https://img.icons8.com/ios-glyphs/50/FFFFFF/security-shield-green.png" alt="security-shield-green" />
                </span>
                <div>
                  <h3>Seguro</h3>
                  <p>Protocolos de seguridad bancaria para proteger tus transacciones e información personal.</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <img width="45" height="45" src="https://img.icons8.com/ios-filled/50/FFFFFF/flash-on.png" alt="flash-on" />
                </span>
                <div>
                  <h3>Rápido</h3>
                  <p>Verificación y procesamiento rápido de tus compras de USDT, sin largas esperas.</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <img width="35" height="35" src="https://img.icons8.com/ios-filled/50/FFFFFF/medal.png" alt="medal" />
                </span>
                <div>
                  <h3>Competitivo</h3>
                  <p>Mejores tasas del mercado con precios transparentes y sin comisiones ocultas.</p>
                </div>
              </div>

              <div className="feature">
                <span className="icon">
                  <img width="35" height="35" src="https://img.icons8.com/ios-filled/50/FFFFFF/phone.png" alt="phone" />
                </span>
                <div>
                  <h3>Soporte 24/7</h3>
                  <p>Nuestro equipo de atención al cliente está disponible las 24 horas para ayudarte.</p>
                </div>
              </div>
            </div>

            <Link to={"/auth"} className="cta">Saber más</Link>
          </div>

          <img className="illustration" src={ImgWhy} alt="" />
        </div>

        <section id="faq" className="container faq">
          <h2>Preguntas frecuentes</h2>
          <p className="dt">Encuentra respuestas a las preguntas más comunes sobre la compra de USDT en Bolivia</p>
          <details>
            <summary>
              ¿Qué es USDT?
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/ffffff/expand-arrow.png" alt="expand-arrow" />
            </summary>
            <p>USDT, conocido como Tether, es una criptomoneda tipo stablecoin diseñada para mantener un valor estable
              en relación con el dólar estadounidense. Está respaldada, teóricamente, por reservas en moneda fiduciaria
              y otros activos.</p>
          </details>
          <details>
            <summary>
              ¿Dónde puedo comprar USDT en Bolivia?
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/ffffff/expand-arrow.png" alt="expand-arrow" />
            </summary>
            <p>En "Nombre Pagina", nos destacamos como líderes en el mercado de criptomonedas en Bolivia. Con una sólida
              presencia nacional y aliados estratégicos en todo el país, ofrecemos transacciones seguras a través de
              los principales bancos Bolivianos. Nuestro equipo especializado está comprometido en brindarte
              asistencia personalizada para garantizar una experiencia sin complicaciones en cada transacción.</p>
          </details>
          <details>
            <summary>
              ¿Cuánto tiempo tarda en completarse una transacción?
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/ffffff/expand-arrow.png" alt="expand-arrow" />
            </summary>
            <p>Las transacciones generalmente se completan en 15-30 minutos después de confirmar el pago. En horario bancario,
              el proceso puede ser aún más rápido. Te mantendremos informado del estado de tu transacción en todo momento.</p>
          </details>
          <details>
            <summary>
              ¿Necesito una billetera digital para comprar USDT?
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/ffffff/expand-arrow.png" alt="expand-arrow" />
            </summary>
            <p>Sí, necesitas una billetera digital que soporte USDT en las redes TRC20 o BEP20. Recomendamos usar Trust
              Wallet o Metamask.
              Si no tienes una, podemos guiarte en el proceso de crear una de manera segura.</p>
          </details>
          <details>
            <summary>
              ¿Cuál es el monto mínimo y máximo para comprar?
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/ffffff/expand-arrow.png" alt="expand-arrow" />
            </summary>
            <p>El monto mínimo de compra es de 10 USDT, mientras que el máximo puede variar según disponibilidad.
              Para montos grandes, recomendamos contactarnos previamente para garantizar la liquidez.</p>
          </details>
          <details>
            <summary>
              ¿Es seguro comprar USDT en su plataforma?
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/ffffff/expand-arrow.png" alt="expand-arrow" />
            </summary>
            <p>Sí, nuestra plataforma implementa múltiples medidas de seguridad, incluyendo verificación de transacciones,
              protección de datos y soporte personalizado.
              Además, operamos de manera transparente y cumplimos con todas las regulaciones aplicables.</p>
          </details>
          <details className="nobb">
            <summary>
              ¿Qué hago si necesito ayuda durante la compra?
              <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/ffffff/expand-arrow.png" alt="expand-arrow" />
            </summary>
            <p>Nuestro equipo de soporte está disponible 24/7 a través de WhatsApp y correo electrónico. Puedes contactarnos
              en cualquier momento y te ayudaremos con cualquier duda o inconveniente que tengas durante el proceso.</p>
          </details>
        </section>
      </main>

      <section className="contact-section">
        <div className="contact-text">
          <h2>Contácto Directo</h2>
          <p>¿No encontraste la respuesta que buscabas?, contanta soporte.</p>
        </div>

        <div className="contact-icons">
          <a href="https://wa.me/59175972099" target="_blank" className="icon whatsapp">
            <i className="fab fa-whatsapp"></i>
          </a>
          {/* <a href="mailto:tucorreo@gmail.com" className="icon gmail">
            <img width="35" height="35" src="https://img.icons8.com/color/48/gmail-new.png" alt="gmail-new" />
          </a> */}
        </div>
      </section>


      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <h3 className="brand">
              <img src={LogoMini} alt="" />
              TetherBOB
            </h3>
            <p>
              La plataforma más confiable para comprar USDT en Bolivia. Segura, rápida y fácil de usar.
            </p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="https://wa.me/59175972099" target="_blank"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Comprar USDT</a></li>
              <li><a href="#">¿Porque elegirnos?</a></li>
              <li><a href="#">¿Como funcionamos?</a></li>
              <li><a href="#">Preguntas frecuentes</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contáctanos</h4>
            <p><i className="fas fa-map-marker-alt"></i> Santa Cruz, Bolivia</p>
            <p><i className="fas fa-phone"></i> +591 75972099</p>
            <p><i className="fas fa-envelope"></i> contact@tetherbob.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} TetherBOB. Todos los derechos reservados.
        </div>
      </footer>

      <a href="https://wa.me/59175972099" target="_blank" className="icon-wf">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
}
