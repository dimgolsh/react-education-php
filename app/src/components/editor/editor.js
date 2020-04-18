import React from "react";
import axios from "axios";

export default class Editor extends React.Component {
  constructor() {
    super();

    this.state = {
      pageList: [],
      newPageName: "",
    };

    this.createNewPage = this.createNewPage.bind(this);
  }

  componentDidMount() {
    this.loadPageList();
  }

  loadPageList() {
    axios.get("./api").then((res) => this.setState({ pageList: res.data }));
  }

  createNewPage() {
    axios
      .post("./api/createNewPage.php", { name: this.state.newPageName })
      .then(this.loadPageList());
  }
  render() {
    const { pageList } = this.state;
    const pages = pageList.map((page, i) => {
      return <h1 key={i}>{page}</h1>;
    });
    return (
      <>
        <input
          onChange={(e) => {
            this.setState({ newPageName: e.target.value });
          }}
          type="text"
        ></input>
        <button onClick={this.createNewPage}>Add page</button>
        {pages}
      </>
    );
  }
}
