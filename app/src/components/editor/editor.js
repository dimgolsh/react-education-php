import React from "react";
import axios from "axios";
import "../../helpers/iframeLoader.js";

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
    this.currentPage = `../${page}`;
    this.iframe.load(this.currentPage, () => {
      console.log('sss',this.currentPage);
      const body = this.iframe.contentDocument.body;
      console.log(body);
      let textNodes = [];

      function recursy(element) {
        element.childNodes.forEach(node => {
          if (node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, '').length > 0) {
            textNodes.push(node);
            console.log(node);
          } else {
            recursy(node);
          }
        });
      }

      recursy(body);
      textNodes.forEach(node => {
          const wrapper = this.iframe.contentDocument.createElement('text-editor');
          node.parentNode.replaceChild(wrapper, node);
          wrapper.appendChild(node);
          wrapper.contentEditable = 'true';
      })
    });
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
