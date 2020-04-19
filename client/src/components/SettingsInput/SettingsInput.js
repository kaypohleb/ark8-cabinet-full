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
                }
            });
            this.setState({
                settings: this.props.settings,
                array: array,
            });
             
         }
    }
    
    handleChange(e){
        if(e.target.className!=="name"){
        let updatedSettings = {...this.state.settings}
        if(this.state.array.includes(e.target.className)){ 
            updatedSettings[e.target.className][e.target.dataset.id] = e.target.value;
            //console.log(updatedSettings[e.target.className][e.target.dataset.id]);
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
        console.log(this.props.gameID);
        let set = 'previous';
        if(this.state.settingsID){
            set = this.state.settingsID;
        }
        this.props.dispatch(setNewSettings(this.state.settings,this.props.gameID,set));
        this.props.dispatch(changeSettings(this.props.roomID,this.props.gameID,this.state.settings));
        this.props.toClose();
    }

    render(){
    let full = null;
    if(this.state.settings){
        var settingnames = Object.keys(this.state.settings);
        full = settingnames.map(name => {
        const obj = this.state.settings[name];
        if(this.state.array.includes(name)){
            return <div key={`${name}-overall`}className={styles.arrayInput}>
                <label key={`${name}-label`}>{name}</label>
                {obj.map((ob,index)=><input type="text" key={`${name}-${index}-input`} value={ob||""} data-id={index} className={name} onChange={this.handleChange}/> )}
                </div>
        }
        else{
            
            return <div key={`${name}-overall`} className={styles.numberInput}>
                <label key={`${name}-label`}>{name}</label>
                <input type="number" max={obj.max} key={`${name}-input`} min={obj.min} className={name} value={obj.defaultValue} onChange={this.handleChange}/>
            </div>
        }
        
        });
    }
    
    return <form className={styles.AllSettings} onInput={this.handleChange} >
        <label>Setting Name</label>
        <input type="text" className="name" placeholder="optional" value = {this.state.settingsID} onChange={this.handleID}/>
        {full}
        <StyledMobileButton onClick={this.handleSubmit}>SAVE</StyledMobileButton>
        </form>;
}
}

export default connect()(SettingsInput);
