import React, { useState } from "react";
import CompModal from "./CompModal";

const CompTarjeta = ({ img, titulo, texto, link,}) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <>
      <div className="card col-sm-3 tarjeta">
        <img src={img} alt={titulo} className="card-img-top" />

        <div className="card-cuerpo">
          <h4 className="card-title">{titulo}</h4>
          <p className="card-text">{texto}</p>

          <a
            href={link}
            className="card-link"
            onClick={() => {
              setMostrarModal(true);
            }}
          >
            Leer más
          </a>
        </div>
      </div>

      {mostrarModal && (
        <CompModal
          title={titulo}
          content={
            <p>
              Disfruta del {texto} <br />
              lo encontrarás en nuestra carta del día, con precios especiales
              en días festivos.
            </p>
          }
          onClose={() => setMostrarModal(false)}
        />
      )}
    </>
  );
};

export default CompTarjeta;

