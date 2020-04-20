import React,{Component} from 'react';
import {connect} from 'react-redux';
import styles from './SettingsInput.module.css';
import {setNewSettings,changeSettings} from '../../store/actions/index';
import { StyledMobileButton } from '../StyledComponents/StyledButton';
class SettingsInput extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleID = this.handleID.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addNewPrompt = this.addNewPrompt.bind(this);
        this.addNewResponse = this.addNewResponse.bind(this);
        this.handleCustom = this.handleCustom.bind(this);
    }
    state={
        settings:{},
        settingsID: "",
    }
    
    componentDidUpdate(prevProps, prevState){
        if(prevProps !== this.props){
            let array = [];
            Object.keys(this.props.settings).forEach(name=>{
                if(Array.isArray(this.props.settings[name])){
                    array.push(name);
                    if(this.props.settings[name].length===0){
                        this.setState({
                            [`${name}`]:[],
                        })
                    }
                }
            });
            this.setState({
                settings: this.props.settings,
                array: array,
            });
             
         }
    }
    addNewPrompt(){
        let updatedCustom = this.state.customPrompts;
        updatedCustom.push("");
        this.setState({
            customPrompts: updatedCustom,
        })
    }
    addNewResponse(){
        let updatedResponse = this.state.customResponse;
        updatedResponse.push("");
        this.setState({
            customResponse: updatedResponse,
        })
    }
    handleCustom(e){
        if(e.target.className==="customPrompts"){
            let updatedCustom = this.state.customPrompts;
            updatedCustom[e.target.dataset.id] = e.target.value;
            this.setState({
                customPrompts: updatedCustom,
               
            })
        }
        else if(e.target.className==="customResponse"){
            let updatedCustom = this.state.customResponse;
            updatedCustom[e.target.dataset.id] = e.target.value;
            this.setState({
                customResponse: updatedCustom,
            })
        }
    }
    handleChange(e){
        
        if(e.target.className!=="name"){
        let updatedSettings = {...this.state.settings}
        if(this.state.array.includes(e.target.className)){ 
            updatedSettings[e.target.className][e.target.dataset.id] = e.target.value;
        }else{
            updatedSettings[e.target.className].defaultValue = parseInt(e.target.value); 
        }
        this.setState({
            settings:updatedSettings,
        })
        }

    }
    handleID(e){
        
        this.setState({
            settingsID:e.target.value,
        })

    }
    handleSubmit(){
        let updatedSettings = {...this.state.settings};
        if(this.state.customPrompts){
            updatedSettings["customPrompts"]  = this.state.customPrompts;
        }
        if(this.state.customResponse){
            updatedSettings["customResponse"]  = this.state.customResponse;
        }
        let set = 'previous';
        if(this.state.settingsID){
            set = this.state.settingsID;
        }
        this.props.dispatch(setNewSettings(updatedSettings,this.props.gameID,set));
        this.props.dispatch(changeSettings(this.props.roomID,this.props.gameID,updatedSettings));
        this.props.toClose();
    }

    render(){
    let full,customPrompts,customResponse = null;
    if(this.state.customPrompts!==undefined && this.state.customPrompts!==null){
        customPrompts =  <div className={styles.arrayInput}>
                    <label>Custom Prompts</label>
                    {
                        this.state.customPrompts.map((prompt,index)=>{
                            return <input key={`customPrompts-${index}`} type="text" data-id={index} className="customPrompts" value={prompt||""} onChange={this.handleCustom}/>
                        })
                    }
                    <button onClick={this.addNewPrompt}>add custom prompts</button>
                </div>
    }
    if(this.state.customResponse!==undefined && this.state.customResponse!==null){
        customResponse =  <div className={styles.arrayInput}>
                    <label>Custom Responses</label>
                    {
                        this.state.customResponse.map((prompt,index)=>{

                            return <input key={`customResponse-${index}`} type="text" data-id={index} className="customResponse" value={prompt||""} onChange={this.handleCustom}/>
                        })
                    }
                    <button onClick={this.addNewResponse}>add custom responses</button>
                </div>
    }
    if(this.state.settings){
        var settingnames = Object.keys(this.state.settings);
        full = settingnames.map(name => {
        const obj = this.state.settings[name];
        if(this.state.array.includes(name)&&obj.length!==0){
            return <div key={`${name}-overall`} className={styles.arrayInput}>
            <label key={`${name}-label`}>{name}</label>
            {obj.map((ob,index)=><input type="text" key={`${name}-${index}-input`} value={ob||""} data-id={index} className={name} onChange={this.handleChange}/> )}
            </div>
            
        }
        else{
            if(!this.state.array.includes(name)){
            return <div key={`${name}-overall`} className={styles.numberInput}>
                <label key={`${name}-label`}>{name}</label>
                <input type="number" max={obj.max} key={`${name}-input`} min={obj.min} className={name} value={obj.defaultValue} onChange={this.handleChange}/>
            </div>
            }else{
                return null;
            }
        }
        
        });
    }
    
    return <div>
        {customPrompts}
        {customResponse}
        <form className={styles.AllSettings} onInput={this.handleChange} >
        <label>Setting Name</label>
        <input type="text" className="name" placeholder="optional" value = {this.state.settingsID} onChange={this.handleID}/>
        {full}
        <StyledMobileButton onClick={this.handleSubmit}>SAVE</StyledMobileButton>
        </form>
        
        </div>;
}
}

export default connect()(SettingsInput);
