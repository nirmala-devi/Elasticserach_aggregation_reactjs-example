import React from 'react';
import '../css/company.css';
import * as esClientCom from '../query/compQuery.js'

class SchCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aggsComp: [],
      cmpNm: '',
      lat: '',
      lon: '',
      suggesstions: []
    }
  }

  changeHandler = event => {
    let value = event.target.value;
    let name = event.target.name;
    this.setState({ [name]: value });
    esClientCom.GetSuggesstion(value).then(res => {
      let sugg = [];
      res.map(ele => sugg.push(ele.cmpName))
      this.setState({ suggesstions: sugg })
    })
  }

  onChange = event => {
    let value = event.target.value;
    let name = event.target.name;
    this.setState({ [name]: value });
  }

  onClick = (ele) => {
    this.setState({
      suggesstions: [],
      cmpNm: ele
    })
  }

  getCompany = (event) => {
    const { cmpNm, lat, lon } = this.state;
    alert(cmpNm);
    if (cmpNm !== '') {
      esClientCom.GetCompByField("cmpName", cmpNm).then(res => {
        console.log("result", res);
        const results = res.hits.hits;
        // const aggre = res.aggregations.categoryFilter.buckets;      
        this.props.getCompanies(results)
        //this.setState({ aggsComp: aggre })
      });
    } else if (lat !== '' && lon !== '') {
      esClientCom.GetCompaniesByGeoRange(lat, lon).then(res => {
        const results = res.hits.hits;
        this.props.getCompanies(results)
      })
    }
  }

  render() {
    const { aggsComp, suggesstions, cmpNm } = this.state;
    const styleAggs = aggsComp.length === 0 ? { display: 'none' } : { display: 'block' };
    const styleComp = this.props.data;
    return (
      <div className="schCompany" style={styleComp}>
        <div className="autoComplete" >
        <label for='cmpNm'>Company Name</label> &nbsp; 
          <input type="text" autoComplete='off' id='cmpNm' name="cmpNm" value={cmpNm} onChange={this.changeHandler.bind(this)} ></input>
          <div className="autocompleteList" >
            <ul >
              {
                suggesstions.map(ele =>
                  <li className='listItem' onClick={this.onClick.bind(this, ele)}>{ele}</li>
                )
              }
            </ul>            
          </div>         
        </div>
        <div>
            <table>
              <tr ><td colspan="2"><strong>Search by Geo location</strong></td></tr>
              <tr>
                <td><label for='lat'>Latitude</label> &nbsp; </td>
                <td><input type="text" name="lat" onChange={this.onChange.bind(this)} ></input> </td>
              </tr>
              <tr>
                <td><label for='lat'>Longitude</label>  &nbsp; </td>
                <td><input type="text" name="lon" onChange={this.onChange.bind(this)} ></input> </td>
              </tr>
            </table>
          </div>
        <br />
        <input type='button' id='search' style={{ align: 'left' }} value='Search' onClick={this.getCompany.bind(this)} />
        <div className="aggs" style={styleComp}>
          <hr align="left"></hr>
          <table style={styleAggs}>
            <tr><td>
              <br />
      CATEGORY  <br />
            </td></tr>
            {
              aggsComp.map(e =>
                <tr>
                  <td > <a href="#" onClick={this.getCompForAggs.bind(this, e)}>{e.key} &nbsp;&nbsp;&nbsp;</a></td>
                  <td width="20%"> {e.doc_count}</td>
                </tr>
              )
            }
          </table>
        </div>
      </div>

    )
  }
}

export default SchCompany;