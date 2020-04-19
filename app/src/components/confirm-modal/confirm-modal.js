import React from "react";
import UIkit from "uikit";

const ConfirmModal = ({ modal, target, method }) => {
  return (
    <div id={target} uk-modal={modal.toString()}>
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Save</h2>
        <p>Вы уверены?</p>
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
          Да
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
