import React from "react";
import axios from "axios";
import "../../helpers/iframeLoader.js";
import DOMHelper from "../../helpers/dom-helpers.js";
import EditorText from '../editor-text/editor-text';

export default class Editor extends React.Component {
  constructor() {
    super();
    this.currentPage = "index.html";

    this.state = {
      pageList: [],
      newPageName: "",
    };

    this.createNewPage = this.createNewPage.bind(this);
  }

  componentDidMount() {
    this.init(this.currentPage);
  }

  init(page) {
    this.iframe = document.querySelector("iframe");
    this.open(page);
    this.loadPageList();
  }
  open(page) {
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
      .then(() => this.iframe.load("../temp.html"))
      .then(() => this.enableEditing())
      .then(()=> this.injectStyles());

    // this.iframe.load(this.currentPage, () => {

    // });
  }

  save() {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    const html = DOMHelper.serializeDOMToString(newDom);
    axios.post("./api/savePage.php", { pageName: this.currentPage, html });
  }

  enableEditing() {
    this.iframe.contentDocument.body
      .querySelectorAll("text-editor")
      .forEach((element) => {
        const id = element.getAttribute("nodeid");
        const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`);

        new EditorText(element, virtualElement)
      });

  //  console.log(this.virtualDom);
  }

  injectStyles(){
      const style = this.iframe.contentDocument.createElement("style");
      style.innerHTML = `
      text-editor:hover {
          outline: 3px solid orange;
          outline-offset: 8px;
      }`;
      this.iframe.contentDocument.head.appendChild(style);
  }

 

  loadPageList() {
    axios.get("./api").then((res) => this.setState({ pageList: res.data }));
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
  render() {
    const { pageList } = this.state;
    const pages = pageList.map((page, i) => {
      return (
        <h1 key={i}>
          {page}
          <a href="#" onClick={() => this.deletePage(page)}>
            *
          </a>
        </h1>
      );
    });
    return (
      <>
        <button
          onClick={() => {
            this.save();
          }}
        >
          Click
        </button>
        <iframe src={this.currentPage} frameBorder="0"></iframe>
        {/*  <input
          onChange={(e) => {
            this.setState({ newPageName: e.target.value });
          }}
          type="text"
        ></input>
        <button onClick={this.createNewPage}>Add page</button>
        {pages} */}
      </>
    );
  }
}
