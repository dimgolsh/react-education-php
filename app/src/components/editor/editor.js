import React from "react";
import axios from "axios";
import "../../helpers/iframeLoader.js";
import DOMHelper from "../../helpers/dom-helpers.js";
import EditorText from "../editor-text/editor-text";
import UIkit from "uikit";
import Spinner from "../spinner/spinner.js";
import ConfirmModal from '../confirm-modal/confirm-modal.js';
import ChooseModal from '../choose-modal/choose-modal.js';

export default class Editor extends React.Component {
  constructor() {
    super();
    this.currentPage = "index.html";

    this.state = {
      pageList: [],
      newPageName: "",
      loading: true,
    };

    this.createNewPage = this.createNewPage.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.save = this.save.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init(null, this.currentPage);
  }

  init(e, page) {
    if(e){
      e.preventDefault();

    }
    this.isLoading();
    this.iframe = document.querySelector("iframe");
    this.open(page, this.isLoaded);
    this.loadPageList();
  }
  open(page, cb) {
    this.currentPage = page;
    axios
      .get(`../${page}?rnd=${Math.random()}`)
      .then((res) => DOMHelper.parseStrDom(res.data))
      .then(DOMHelper.wrapTextNodes)
      .then((dom) => {
        this.virtualDom = dom;
        return dom;
      })
      .then(DOMHelper.serializeDOMToString)
      .then((html) => axios.post("./api/saveTempPage.php", { html }))
      .then(() => this.iframe.load("../ehhmdrtyh43.html"))
     // .then(()=>axios.post('./api/deletePage.php',{"name":"ehhmdrtyh43.html"}))
      .then(() => this.enableEditing())
      .then(() => this.injectStyles())
      .then(cb);

    // this.iframe.load(this.currentPage, () => {

    // });
  }

  save(onSucceess, onErrorr) {
    this.isLoading();
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    const html = DOMHelper.serializeDOMToString(newDom);
    axios
      .post("./api/savePage.php", { pageName: this.currentPage, html })
      .then(onSucceess)
      .catch(onErrorr)
      .finally(this.isLoaded);
  }

  enableEditing() {
    this.iframe.contentDocument.body
      .querySelectorAll("text-editor")
      .forEach((element) => {
        const id = element.getAttribute("nodeid");
        const virtualElement = this.virtualDom.body.querySelector(
          `[nodeid="${id}"]`
        );

        new EditorText(element, virtualElement);
      });

    //  console.log(this.virtualDom);
  }

  injectStyles() {
    const style = this.iframe.contentDocument.createElement("style");
    style.innerHTML = `
      text-editor:hover {
          outline: 3px solid orange;
          outline-offset: 8px;
      }`;
    this.iframe.contentDocument.head.appendChild(style);
  }

  loadPageList() {
    axios.get("./api/pageList.php").then((res) => this.setState({ pageList: res.data }));
  }

  createNewPage() {
    axios
      .post("./api/createNewPage.php", { name: this.state.newPageName })
      .then(this.loadPageList());
  }

  deletePage(page) {
    axios
      .post("./api/deletePage.php", { name: page })
      .then(this.loadPageList())
      .catch(() => {
        console.log("eroror");
      });
  }
  isLoaded() {
    this.setState({
      loading: false,
    });
  }

  isLoading() {
    this.setState({
      loading: true,
    });
  }
  render() {
    const { loading , pageList} = this.state;
    const modal = true;

    let spinner;
    loading ? (spinner = <Spinner active />) : (spinner = <Spinner />);

    return (
      <>
        {spinner}
        <iframe src={this.currentPage} frameBorder="0"></iframe>

        <div className="panel">
        <button className="uk-button uk-button-primary uk-margin-small-right" uk-toggle="target: #modal-open"> Открыть </button>
          <button className="uk-button uk-button-primary " uk-toggle="target: #modal-save"> Опубликовать </button>
      
        </div>

        <ConfirmModal modal={modal} target={'modal-save'} method={this.save}/>
        <ChooseModal modal={modal} target={'modal-open'} data={pageList} redirect={this.init} />
       
      </>
    );
  }
}
