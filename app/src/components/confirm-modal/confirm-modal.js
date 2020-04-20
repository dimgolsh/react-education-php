import React from "react";
import UIkit from "uikit";

const ConfirmModal = ({ modal, target, method, text }) => {
  const { title, description, btn } = text;

  return (
    <div id={target} uk-modal={modal.toString()}>
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">{title}</h2>
        <p>{description}</p>
        <button
          className="uk-button uk-button-primary  uk-modal-close"
          type="button"
          onClick={() =>
            method(
              () => {
                UIkit.notification({
                  message: "Notification message",
                  status: "success",
                });
              },
              () => {
                UIkit.notification({ message: "Error", status: "danger" });
              }
            )
          }
        >
          {btn}
        </button>
        <button
          className="uk-button uk-button-secondary uk-modal-close"
          type="button"
        >
          Нет
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
