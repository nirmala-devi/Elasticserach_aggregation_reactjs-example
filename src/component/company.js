import React from 'react';
import DOMPurify from 'dompurify';
import './company.css';

class Company extends React.Component {

  renderCompList = (companies) => {
    // const dirty = `I love to do <mark>evil</mark> <img src="http://unsplash.it/100/100?random" onload="alert('you got hacked');" />`;
    return (
      <ul>
        {
          companies.map(e =>
            <li id="aggRst"><a href='#'><h2>&nbsp;&nbsp;&nbsp;{e._source.cmpName}</h2></a>
              <span> Country: {e._source.country}</span><br /><br />
              <span> City: {e._source.loc}</span><br /><br />
              <span> State: {e._source.state}</span><br /><br />
              <span> Company Type: {e._source.cmpType}</span><br /><br />
              <span> Category: {e._source.category}</span><br /><br />
              <span> Facebook: {e._source.fb}</span><br /><br />
              <span> twitter: {e._source.twitter}</span><br /><br />
              <span> Linkedin: {e._source.linkedin}</span><br /><br />

              {
                this.renderHighlights(e.highlight)
              }
            </li>
          )
        }
      </ul>
    )
  }

  renderHighlights = (highlights) => {
    var renderHigh = [];
    if (highlights !== undefined) {
      if (highlights.about !== undefined) {
        renderHigh.push("<span>About:</span>")
        highlights.about.map(ele =>
          renderHigh.push(ele)
        )
      }
      if (highlights.products !== undefined) {
        renderHigh.push("<br/><span>Products:</span>")
        highlights.products.map(ele =>
          renderHigh.push(ele)
        )
      }
      if (highlights.awards !== undefined) {
        renderHigh.push("<br/><span>Awards:</span>")
        highlights.awards.map(ele =>
          renderHigh.push(ele)
        )
      }
      if (highlights.jobs !== undefined) {
        renderHigh.push("<br/><span>Jobs:</span>")
        highlights.jobs.map(ele =>
          renderHigh.push(ele)
        )
      }
      if (highlights.news !== undefined) {
        renderHigh.push("<br/><span>News:</span>")
        highlights.news.map(ele =>
          renderHigh.push(ele)
        )
      }
      if (highlights.faq !== undefined) {
        renderHigh.push("<br/><span>FAQ:</span>")
        highlights.faq.map(ele =>
          renderHigh.push(ele)
        )
      }
    }

    return (
      <div>
        {
          renderHigh.map(ele =>
            <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ele) }} />
          )
        }
      </div>
    );
  }

  render() {
    var companies = this.props.data
    return (
      <div className="comp">
        <div className="rstComp">
          {this.renderCompList(companies)}
        </div>
        {
          companies.length === 0 ?
            <p >Give a value to search</p> : ""
        }
      </div>
    );
  }
}

export default Company