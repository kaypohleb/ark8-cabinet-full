import React, {Component} from 'react';
import { StyledSelect } from '../StyledComponents/StyledSelect';

class DynamicSelect extends Component{

    //On the change event for the select box pass the selected value back to the parent
    handleChange = (event) =>
    {
        this.props.onSelectChange(event.target.value);
    }

    render(){
        let options = null;
        if(this.props.settingsList){
            options = this.props.settingsList.map((data) =>
                data.settingsName.map(setting=>{
                    return(<option 
                    key={setting}
                    value={setting}
                    >
                    {setting} ({data.player})
                </option>)
                })
            );
        }

            return (
            <StyledSelect onChange={this.handleChange}>
                <option default value="default">default</option>
                {options}
           </StyledSelect>
        )
    }
}

export default DynamicSelect;