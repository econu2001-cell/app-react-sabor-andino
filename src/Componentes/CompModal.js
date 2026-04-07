import React from "react";

function CompModal({ title, content, onClose }) {
    return (
        <div className="modal-backdrop-custom">
            <div className="modal-caja">

                <div className="modal-caja-header">
                    <h5 className="modal-caja-titulo">{title}</h5>
                    <button className="modal-caja-cerrar" onClick={onClose}>✕</button>
                </div>

                <div className="modal-caja-body">
                    {content}
                </div>

                <div className="modal-caja-footer">
                    <button className="btn btn-danger" onClick={onClose}>
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CompModal;