import React from 'react'
import axios from 'axios';


export default class Editor extends React.Component{
    constructor(){
        super();

        this.state = {
            pageList: [],
            newPageName: ""
        }
    }

    render(){

        return (
            <>
                <input type="text"></input>
                <button>Add page</button>
            </>
        )
    }
}