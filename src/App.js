

import React, { useEffect } from 'react';
import Person from './domain/person';
import Company from './domain/company'
import * as esClient from './query/esQuery.js'
import Advancedsch from './domain/advancedSch.js'
import PersonAggs from './domain/psnAgg.js'
import SchCompany from './domain/schComp.js'
import './autosuggest.css';
import './App.css';
import './tabStyle.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      psnLst: [],
      field: '',
      schStr: "",
      aggs: {
        aggsCity: [],
        aggsState: [],
        aggsLoc: [],
        aggsHobby: [],
        aggsDob: [],
        aggsAnniv: []
      },
      showPsn: true,
      showCompp: false,
      companies: [],
      aggsComp: []
    };
  }

  changeHandler = event => {
    let value = event.target.value;
    this.setState({ value: value });

  }

  getPsn = (schCriteria) => {
    const { field, value, srcInc, radio } = schCriteria;
    console.log("selected Value", schCriteria)
    this.setState({ aggsCity: [], aggsState: [], aggsDob: [], aggsAnniv: [], aggsLoc: [], aggsHobby: [] });
    esClient.GetPsn(field, value, srcInc, radio).then(res => {
      if (radio === 'aggs') {
        let { aggregations: { cityFilter: { buckets: aggsCity } } } = res;
        let { aggregations: { stateFilter: { buckets: aggsState } } } = res;
        let { aggregations: { hobbyFlt: { buckets: aggsHobby } } } = res;
        let { aggregations: { locFlt: { buckets: aggsLoc } } } = res;
        let { aggregations: { birthMonth: { buckets: aggsDob } } } = res;
        let { aggregations: { annMonth: { buckets: aggsAnniv } } } = res;
        let aggs = { aggsCity, aggsState, aggsDob, aggsAnniv, aggsLoc, aggsHobby }
        this.setState({ aggs: aggs });
      } else {
        this.setState({ psnLst: res })
      }
    })
  }

  getItemForAggs = (idLst) => {
    esClient.GetItemsForAggs(idLst, true).then(res => {
      console.log("Psn", res)
      this.setState({ psnLst: res })
    });
  }

  openDomain = (name) => {
    this.resetState();
    if (name === 'Person') {
      this.setState({ showPsn: true, showCompp: false })
    } else {
      this.setState({ showCompp: true, showPsn: false })
    }
  }

  resetState = () => {
    this.setState({ aggsComp: [], companies: [], value: '', psnLst: [] });
    this.setState({
      aggs: {
        aggsCity: [],
        aggsState: [],
        aggsLoc: [],
        aggsHobby: [],
        aggsDob: [],
        aggsAnniv: []
      }
    });

  }

  setComp = (compLst) => {
    this.setState({ companies: compLst })
  }

  getCompForAggs = (event) => {
    let { top_hit_vl: { hits: { hits: ids } } } = event;
    let idLst = [];
    ids.forEach(e => idLst.push(e._id));
    esClient.GetItemsForAggs(idLst, false).then(res => {
      console.log("comp", res)
      this.setState({ companies: res })
    });

  }
  render() {
    //inputs for autosuggest
    const { aggs, showPsn, showCompp, companies } = this.state
    const data = this.state.psnLst;
    const stylePsn = showPsn ? { display: 'block' } : { display: 'none' }
    const styleComp = showCompp ? { display: 'block' } : { display: 'none' }

    return (
      <div className="App" style={{ maxWidth: "100%" }}>
        <div className="search" >
          <Advancedsch psnSty={stylePsn} getValue={this.getPsn.bind(this)}></Advancedsch>
          <PersonAggs data={aggs} selectedIds={this.getItemForAggs.bind(this)}></PersonAggs>
          <SchCompany data={styleComp} getCompanies={this.setComp.bind(this)}></SchCompany>
        </div>
        <div className="vl"></div>
        <div className="rightPanel">
          <div className="tab">
            <button className={showPsn ? "tabLinks active" : "tabLinks"} onClick={this.openDomain.bind(this, 'Person')}>Person</button>
            <button className={showCompp ? "tabLinks active" : "tabLinks"} onClick={this.openDomain.bind(this, 'Company')}>Company</button>
          </div>
          <div id="Person" style={stylePsn} className="tabContent">
            <Person data={data}></Person>
          </div>
          <div id="Company" style={styleComp} className="tabContent">
            <Company data={companies}></Company>
          </div>
        </div>
      </div>
    );
  }

}



export default App;