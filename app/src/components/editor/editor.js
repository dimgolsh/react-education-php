import React from "react";
import axios from "axios";
import "../../helpers/iframeLoader.js";
import DOMHelper from "../../helpers/dom-helpers.js";
import EditorText from "../editor-text/editor-text";
import UIkit from "uikit";
import Spinner from "../spinner/spinner.js";
import ConfirmModal from '../confirm-modal/confirm-modal.js';
import ChooseModal from '../choose-modal/choose-modal.js';
import Panel from '../panel/panel.js';
import EditorMeta from '../editor-meta/editor-meta.js';
import EditorImages from '../editor-images/editor-images.js';


export default class Editor extends React.Component {
  constructor() {
    super();
    this.currentPage = "index.html";

    this.state = {
      pageList: [],
      newPageName: "",
      backups: [],
      loading: true,
    };

    this.createNewPage = this.createNewPage.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.save = this.save.bind(this);
    this.init = this.init.bind(this);
    this.restoreBackup = this.restoreBackup.bind(this);
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
    this.loadBackupList();
  }
  open(page, cb) {
    this.currentPage = page;
    axios
      .get(`../${page}?rnd=${Math.random()}`)
      .then((res) => DOMHelper.parseStrDom(res.data))
      .then(DOMHelper.wrapTextNodes)
      .then(DOMHelper.wrapImages)
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

      this.loadBackupList();
    // this.iframe.load(this.currentPage, () => {

    // });
  }

 async save(onSucceess, onErrorr) {
    this.isLoading();
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    DOMHelper.unwrapImages(newDom);
    const html = DOMHelper.serializeDOMToString(newDom);
    await axios
      .post("./api/savePage.php", { pageName: this.currentPage, html })
      .then(()=> this.showNotifications('Успешно сохранен','success'))
      .then(onSucceess)
      .catch(onErrorr)
      .catch(()=> this.showNotifications('ddd','danger'))
      .finally(this.isLoaded);

      this.loadBackupList();
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

      this.iframe.contentDocument.body
      .querySelectorAll("[editableimgid]")
      .forEach((element) => {
        const id = element.getAttribute("editableimgid");
        const virtualElement = this.virtualDom.body.querySelector(
          `[editableimgid="${id}"]`
        );

        new EditorImages(element, virtualElement, this.isLoading, this.isLoaded, this.showNotifications);
      });

    //  console.log(this.virtualDom);
  }

  injectStyles() {
    const style = this.iframe.contentDocument.createElement("style");
    style.innerHTML = `
      text-editor:hover {
          outline: 3px solid orange;
          outline-offset: 8px;
      }
      [editableimgid]:hover {
        outline: 3px solid orange;
          outline-offset: 8px;
      }
      `;
    this.iframe.contentDocument.head.appendChild(style);
  }

  showNotifications(message, status){
    UIkit.notification({message, status});


  }
  loadPageList() {
    axios.get("./api/pageList.php").then((res) => this.setState({ pageList: res.data }));
  }

  loadBackupList(){
    axios
    .get('./backups/backups.json')
    .then(res=> {console.log(res.data); return res})
    .then(res => this.setState({backups: res.data.filter(backup=>{ return backup.page === this.currentPage; })}))
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


  restoreBackup(e,backup){
    if(e){
      e.preventDefault();

    }
    UIkit.modal.confirm('You arse',{labels: {ok: 'Yes', cancel: 'Otmena'}})
    .then(()=>{
      this.isLoading();
      return axios
      .post('./api/restoreBackup.php',{'page':this.currentPage, 'file': backup})
    })
    .then(()=>{
      this.open(this.currentPage, this.isLoaded);
    })
  }
  isLoading() {
    this.setState({
      loading: true,
    });
  }
  render() {
    const { loading , pageList, backups} = this.state;
    const modal = true;

    let spinner;
    console.log(backups);
    loading ? (spinner = <Spinner active />) : (spinner = <Spinner />);

    return (
      <>
        {spinner}
        <iframe src='' frameBorder="0"></iframe>
        <input id='img-upload' type='file' accept='image/*' style={{display: 'none'}}></input>

        <Panel/>
        <ConfirmModal modal={modal} target={'modal-save'} method={this.save}/>
        <ChooseModal modal={modal} target={'modal-open'} data={pageList} redirect={this.init} />
        <ChooseModal modal={modal} target={'modal-backup'} data={backups} redirect={this.restoreBackup} />
        {this.virtualDom ?  <EditorMeta modal={modal} target={'modal-meta'} virtualDom={this.virtualDom}/> : false}
       
       
      </>
    );
  }
}
