import React from 'react';

class PersonAggs extends React.Component {
  constructor(props){
    super(props);
    this.state = {      
      aggsDob: [],
      aggsAnniv: []
    }
  }

  getPsnForAggs = (e) => {
    let { top_hit_vl: { hits: { hits: ids } } } = e;
    let idLst = [];
    ids.forEach(e => idLst.push(e._id));
    this.props.selectedIds(idLst)
  }

  getPsnForDob = (aggsDob,event) => {
   // const { aggsDob } = this.state;
    let vl = event.target.value;
    aggsDob.map(ele => {
      if (ele['key_as_string'] === vl) {
        this.getPsnForAggs(ele)
      }
    })
  }

  getPsnForAnniv = (aggsAnniv,event) => {
    //const { aggsAnniv } = this.state;
    let vl = event.target.value;
    aggsAnniv.map(ele => {
      if (ele['key_as_string'] === vl) {
        this.getPsnForAggs(ele)
      }
    })
  }

  render() {
    const aggs = this.props.data;
    const {aggsCity, aggsState, aggsDob, aggsAnniv, aggsLoc, aggsHobby} =  aggs
    const styleAnn = aggsAnniv.length === 0 ? { display: 'none' } : { display: 'block' };
    const styleDob = aggsDob.length === 0 ? { display: 'none' } : { display: 'block' };
    
    return (
      <div className='Aggs'>
        {
          aggsCity.length !== 0 ? <span>CITIES</span> : ""
        }
        <ul>
          {
            aggsCity.map(e =>
              <li>
                <a href="#" onClick={this.getPsnForAggs.bind(this, e)}>{e.key}</a> &nbsp;&nbsp;&nbsp;{e.doc_count}
              </li>
            )
          }
        </ul><br />
        {
          aggsState.length !== 0 ? <span>STATES</span> : ""
        }
        <ul>
          {
            aggsState.map(e =>
              <li>
                <a href="#" onClick={this.getPsnForAggs.bind(this, e)}>{e.key}</a> &nbsp;&nbsp;&nbsp;{e.doc_count}
              </li>
            )
          }
        </ul> <br />
        <div style={styleDob}>
          <span>Birth Month</span>    <br />
          <input type="range" id="dob" name="dob" min="1" max="12" defaultValue='1' onChange={this.getPsnForDob.bind(aggsDob)}></input> <br />
        </div>
        <div style={styleAnn}>
          <span>Anniversary Month</span>    <br />
          <input type="range" id="anive" name="anive" min="1" max="12" defaultValue='1' onChange={this.getPsnForAnniv.bind(aggsAnniv)}></input> <br />
        </div>
        {
          aggsHobby.length !== 0 ? <span>HOBBIES</span> : ""
        }
        <ul>
          {
            aggsHobby.map(e =>
              <li>
                <a href="#" onClick={this.getPsnForAggs.bind(this, e)}>{e.key}</a> &nbsp;&nbsp;&nbsp;{e.doc_count}
              </li>
            )
          }
        </ul><br />
        {
          aggsLoc.length !== 0 ? <span>LOCATION</span> : ""
        }
        <ul>
          {
            aggsLoc.map(e =>
              <li>
                <a href="#" onClick={this.getPsnForAggs.bind(this, e)}>{e.key}</a> &nbsp;&nbsp;&nbsp;{e.doc_count}
              </li>
            )
          }

        </ul> <br />
      </div>
    );
  }
}

export default PersonAggs;