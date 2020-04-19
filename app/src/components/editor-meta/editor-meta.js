import React from "react";
export default class EditorMeta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      meta: {
        title: "",
        keywords: "",
        description: "",
      },
    };
  }

  componentDidMount() {
    this.getMeta(this.props.virtualDom);
  }

  componentDidUpdate(prevProps){
    if(this.props.virtualDom !== prevProps.virtualDom){
        this.getMeta(this.props.virtualDom);
    }
  }

  getMeta(virtualDom) {
    this.title =
      virtualDom.head.querySelector("title") ||
      virtualDom.head.appendChild(virtualDom.createElement("title"));

    this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');
    if (!this.keywords) {
      this.keywords = virtualDom.head.appendChild(
        virtualDom.createElement("meta")
      );
      this.keywords.setAttribute("name", "keywords");
      this.keywords.setAttribute("content", "");
    }
    this.description = virtualDom.head.querySelector('meta[name="keywords"]');
    if (!this.description) {
      this.description = virtualDom.head.appendChild(
        virtualDom.createElement("description")
      );
      this.description.setAttribute("name", "description");
      this.description.setAttribute("content", "");
    }

    this.setState({
      meta: {
        title: this.title.innerHTML,
        keywords: this.keywords.getAttribute("content"),
        description: this.description.getAttribute("content"),
      },
    });
  }

  applyMeta() {
    this.title.innerHTML = this.state.meta.title;
    this.keywords.setAttribute("content", this.state.meta.keywords);
    this.description.setAttribute("content", this.state.meta.description);
  }

  onValueChange(e){

    if(e.target.getAttribute('data-title')){
        e.persist();
        this.setState(({meta})=>{
            const newMeta ={
                ...meta,
                title: e.target.value
            }
            return {
                meta: newMeta
            }
        })
    } else if(e.target.getAttribute('data-key')){
        e.persist();
        this.setState(({meta})=>{
            const newMeta ={
                ...meta,
                keywords: e.target.value
            }
            return {
                meta: newMeta
            }
        })
    } else {
        e.persist();
        this.setState(({meta})=>{
            const newMeta ={
                ...meta,
                description: e.target.value
            }
            return {
                meta: newMeta
            }
        })
    }
  }
  render() {
    const { modal, target } = this.props;
    const { title, keywords, description } = this.state.meta;

    return (
      <div id={target} uk-modal={modal.toString()}>
        <div className="uk-modal-dialog uk-modal-body">
          <h2 className="uk-modal-title">Save</h2>
          <form action="">
            <div class="uk-margin">
              <input
                data-title
                class="uk-input"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => this.onValueChange(e)}
              />
            </div>
            <div class="uk-margin">
              <input
                data-key
                class="uk-input"
                type="text"
                placeholder="keywords"
                value={keywords}
                onChange={(e) => this.onValueChange(e)}
              />
            </div>
            <div class="uk-margin">
              <input
                data-description
                class="uk-input"
                type="text"
                placeholder="desc"
                value={description}
                onChange={(e) => this.onValueChange(e)}
              />
            </div>
          </form>
          <button
            className="uk-button uk-button-primary  uk-modal-close"
            type="button"
            onClick={() => this.applyMeta()}
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
  }
}
