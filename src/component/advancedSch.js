import React from 'react';
import Select from 'react-select';
import Autosuggest from 'react-autosuggest';
import * as esClient from '../query/esQuery.js'


class Advancedsch extends React.Component {
  constructor(props){
    super(props);   
    this.state ={
      value: '',  
      field:'',
      srcInc: [],     
      radio: '',
      suggestions:[]
    }   
  }

  renderSuggestion = suggestion => {
    var { field, value } = this.state;
    if (field.length === 0) {
      field = 'fullTxtStr'
    }
    let sugg = ""
    if (field === "hobbies") {
      let hobbies = suggestion[field];
      var found = hobbies.findIndex(e => e.toLowerCase().startsWith(value));
      sugg = hobbies[found];
    } else {
      sugg = suggestion[field];
    }
    return (
      <div className="result">
        <div>{sugg}</div>
      </div>
    )
  }

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue })
  }

  dropdownHandler = event => {
    let value = event.value;
    this.setState({ field: value })
    this.setState({ value:'',suggestions:[] })
  }

  dropdownHandlerMultiSel = e => {
    let value = Array.isArray(e) ? e.map(x => x.value) : []
    this.setState({ srcInc: value })

  }

  handleCbChange = e => {
    let vl = e.target.value;   
    this.setState({ radio: vl });    
  }

  onSuggestionsFetchRequested = ({ value }) => {
    var { field } = this.state;
    var oldVl = this.state.value;    
    if (field.length === 0) {
      field = 'fullTxtStr'
    }
    if (oldVl !== value) {
      esClient.GetSuggesstion(value, field).then(res => {
        console.log("sugg", res);
        this.setState({ suggestions: res });
      })
    }
  }

  getSuggestionValue = suggestion => {
    var { field, value } = this.state;
    if (field.length === 0) {
      field = 'fullTxtStr'
    }
    let sugg = ""
    if (field === "hobbies") {
      let hobbies = suggestion[field];
      var found = hobbies.findIndex(e => e.toLowerCase().startsWith(value));
      sugg = hobbies[found];
    } else {
      sugg = suggestion[field];
    }
    return sugg;
  } 

  fldSelectedAndSchVl = () =>{
    const { field, value, srcInc, isFuzziness, radio } = this.state;
    if (value.length === 0) {
      alert("Please give a value to search");
      return "";
    }
    const schCriteria = {
      field,value, srcInc, isFuzziness, radio
    }
    this.props.getValue(schCriteria); 
    console.log("schCriteria",schCriteria)
  }

  render() {
     const {value,suggestions} = this.state
     const stylePsn = this.props.psnSty;
    const options = [
      { value: "fname", label: "First Name" },
      { value: "lname", label: "Last Name" },
      { value: "sname", label: "Surname" },
      { value: "email", label: "Email" },
      { value: "state", label: "State" },
      { value: "city", label: "City" },
      { value: "country", label: "Country" },
      { value: "loc", label: "Location" },
      { value: "hobbies", label: "Hobbies" }
    ];
    const inputProps = {
      placeholder: 'Give a value ',
      value,
      onChange: this.onChange
    }
    return (
      <div className="searchCrt"  style={stylePsn}>
        <table>
          <tr>
            <td>
              <label for='source'>Source Include</label> &nbsp;&nbsp;&nbsp;
            <Select options={options} id="source" isMulti onChange={this.dropdownHandlerMultiSel} />
            </td>
          </tr>
          <tr>
            <td>
              <label for='schCrt'>Search With</label> &nbsp;&nbsp;&nbsp;
            <Select options={options} id="schCrt" onChange={this.dropdownHandler} />
            </td>
          </tr>
          <tr>
            <td >
              <label for='schVl'>Search Value</label> &nbsp;&nbsp;&nbsp;
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}                
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
              />
            </td>
          </tr>         
          <tr>
            <td>
              <strong>Search options</strong><br />
              <input type='radio' id='fuzzy' onChange={this.handleCbChange} value='Fuzzy' name='schOpt' /><label for='fuzzy'>Fuzziness</label>
              <br />
              <input type='radio' id='prefix' onChange={this.handleCbChange} value='Prefix' name='schOpt' /><label for='prefix'>Prefix</label>
              <br />
              <input type='radio' id='wldcard' onChange={this.handleCbChange} value='wldcard' name='schOpt' /><label for='wldcard'>Wildcard</label>
              <br />
              <input type='radio' id='aggs' onChange={this.handleCbChange} value='aggs' name='schOpt' /><label for='aggs'>Aggregation</label>
            </td>
          </tr>   
          <tr>
            <td><input type='button' id='search' value='Search' onClick={this.fldSelectedAndSchVl} /></td>
          </tr>       
        </table>
        <hr align="left"></hr>
      </div>
    );
  }
}

export default Advancedsch