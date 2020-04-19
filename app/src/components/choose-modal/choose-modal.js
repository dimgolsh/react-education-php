import React from "react";

const ChooseModal = ({ target, modal, data, redirect }) => {

    const pageList = data.map((item)=>{
        return (
            <li key={item}>
                <a className="uk-link-muted uk-modal-close" href="#"
                onClick={e=>redirect(e, item)}
                >{item}</a>
            </li>
        )
    })
  return (
    <div id={target} uk-modal={modal.toString()}>
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Save</h2>
        <ul className="uk-list uk-list-divider">
        {pageList}
        
        </ul>
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

export default ChooseModal;
