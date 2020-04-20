import React from 'react'
export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pass: ''
        }
    }

    onPasswordChange(e){
        this.setState({
            pass: e.target.value
        })
    }
    render(){

        const {login, lengthErr, logErr} = this.props;

        let renderLogErr, renderLengthErr;

        logErr ? renderLogErr =  <span className="login-error">Not neverniy</span> : null;

        lengthErr ? renderLengthErr =    <span className="login-error">Very short </span> : null;


        return (
            <div className='login-container'>
                <div className="login">
                    <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
                    <div className="uk-margin-top uk-text-lead">Passowrd</div>
                    <input 
                    type="password"
                     name="" id='' 
                     className='uk-input uk-margin-top' 
                     placeholder='passeord'
                     value={this.state.pass}
                     onChange={(e)=>this.onPasswordChange(e)}
                     ></input>
                   
                    {renderLogErr}
                    {renderLengthErr}
                    <button className='uk-button uk-button-primary'
                    type='button'
                    onClick={()=>login(this.state.pass)}
                    >Login</button>
                </div>

            </div>
        )
    }
}