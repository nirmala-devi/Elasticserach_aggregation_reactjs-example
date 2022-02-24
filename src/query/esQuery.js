
import { callEs, indexSchVl } from './tsiteEs.js';
const PERSON_INDEX = "persondomain_dev";

export const GetSuggesstion = async (qryStr, field) => {
  const source = [field];
  let suggest = {
    suggest: {
      suggester: {
        prefix: qryStr,
        completion: {
          field: field + ".completion",
          skip_duplicates: true
        }
      }
    },
    sort: ['_score']
  }
  let queryBody = {
    index: PERSON_INDEX,
    size: 0,
    _source: source,
    body: suggest
  }
  let res = await callEs(queryBody);
  if (res !== undefined) {
    let result = res.suggest.suggester[0].options.map(h => h._source);
    return result;
  }
  else {
    return ""
  }
}

export const GetPsn = async (field, value, srcInc, radio) => {
  var locStorKey = '';

  var fullTxtQry = {
    "query": {
      "bool": {
        "must": {
          "simple_query_string": {
            "query": "\"" + value + "\""
          }
        },
        "must_not": {
          "match": {
            "fullTxtStr": {
              "query": value

            }
          }
        }
      }
    }
  }
  const schQuery = {
    query: {
      match: {
        [field]: {
          query: "\"" + value + "\""
        }
      }
    }
  }


  let queryBody;
  if (field.length === 0) {
    locStorKey = value + "$#FullTxtQry"
    if (radio === 'Fuzzy') {
      fullTxtQry['query']['bool']['must']['simple_query_string']['query'] =
        fullTxtQry['query']['bool']['must']['simple_query_string']['query'] + " | " + value + "~1"
      queryBody = fullTxtQry;
      locStorKey = locStorKey + '$#Fuzzy-On';
    }
    if (radio === 'Prefix') {
      fullTxtQry['query']['bool']['must']['simple_query_string']['query'] =
        fullTxtQry['query']['bool']['must']['simple_query_string']['query'] + " | " + value + "*"
      queryBody = fullTxtQry;
      locStorKey = locStorKey + '$#Prefix-On'
    } else if (radio === 'aggs') {
      locStorKey = locStorKey + '$#Aggs-On'
      let aggsRst = getAggs(field, value, locStorKey);
      return aggsRst;
    }
    else {
      queryBody = fullTxtQry;
    }
  } else {
    locStorKey = value + '$#' + field;
    switch (radio) {
      case 'Fuzzy':
        locStorKey = locStorKey + '$#Fuzzy-On';
        queryBody = {
          query: {
            match: {
              [field]: {
                query: "\"" + value + "\"",
                fuzziness: "AUTO"
              }
            }
          }
        }
        break;
      case 'Prefix':
        locStorKey = locStorKey + '$#Prefix-On'
        queryBody = {
          query: {
            prefix: {
              [field]: {
                value: value
              }
            }
          }
        }
        break;
      case 'wldcard':
        locStorKey = locStorKey + '$#Wldcard-On'
        queryBody = {
          query: {
            wildcard: {
              [field]: {
                value: value
              }
            }
          }
        }
        break;
      case 'aggs':
        locStorKey = locStorKey + '$#Aggs-On'
        let aggsRst = getAggs(field, value, locStorKey);
        return aggsRst;
      default:
        queryBody = schQuery;
    }
  }
  let query = {
    index: PERSON_INDEX,
    _source: srcInc,
    size: 50,
    body: queryBody
  }
  console.log("getPsn query", queryBody)
  const cachedHit = localStorage.getItem(locStorKey);
  console.log('cachedhit', JSON.stringify(cachedHit))
  if (cachedHit) {
    return JSON.parse(cachedHit);
  } else {
    try {
      let res = await callEs(query);
      const results = res.hits.hits.map(h => h._source);
      console.log("getPsn ", results);
      let finalRst = setResult(locStorKey, results);
      //Store full text search string into elasticsearch, when user searchs without field name. To support auto suggestion
      if (field.length === 0 & radio !== 'Prefix') {
        if (results !== undefined & results.length !== 0) {
          let indexQry = {
            index: PERSON_INDEX,
            id: value,
            body: {
              fullTxtStr: value
            }
          }
          try {
            let res = await indexSchVl(indexQry)
            console.log("Index full text search", res)
          } catch (err) {
            console.log("Error", err)
          }
        }
      }
      return finalRst;
    } catch (err) {
      console.log("Error", err)
    }

  }
}

export const GetItemsForAggs = async (idLst, isPSn) => {
  var size = idLst.length;
  let query = {
    query: {
      ids: {
        values: idLst
      }
    }
  }
  let qryBody = {
    index: PERSON_INDEX,
    size: size,
    body: query
  }
  try {
    let res = await callEs(qryBody);
    const results = res.hits.hits.map(h => h._source)
    results.forEach(e => e.hobbies = e.hobbies.toString());
    return results;
  } catch (err) {
    console.log("error", err)
  }
}



const setResult = (key, result) => {
  result.forEach(e => {
    if (e.hobbies !== undefined) {
      e.hobbies = e.hobbies.toString()
    }
  });
  //Store search result in app memory
  if (localStorage.length <= 10) {
    localStorage.setItem(key, JSON.stringify(result));
  }
  return result;
}

const getAggs = async (field, value, key) => {
  let fieldToSrch = []
  if (field.length !== 0) {
    fieldToSrch.push(field);
  }
  value = value.toLocaleLowerCase();
  let query = {
    query: {
      simple_query_string: {
        query: `\\"${value}\\"`,
        fields: fieldToSrch
      }
    },
    aggs: {
      cityFilter: {
        terms: {
          field: "city.keyword"
        },
        aggs: {
          top_hit_vl: {
            top_hits: {
              _source: false,
              size: 100
            }
          }
        }
      },
      stateFilter: {
        terms: {
          field: "state.keyword"
        },
        aggs: {
          top_hit_vl: {
            top_hits: {
              _source: false,
              size: 100
            }
          }
        }
      },
      hobbyFlt: {
        terms: {
          field: "hobbies.keyword"
        },
        aggs: {
          top_hit_vl: {
            top_hits: {
              _source: false,
              size: 100
            }
          }
        }
      },
      locFlt: {
        terms: {
          field: "loc.keyword"
        },
        aggs: {
          top_hit_vl: {
            top_hits: {
              _source: false,
              size: 100
            }
          }
        }
      },
      birthMonth: {
        date_histogram: {
          field: "dob",
          interval: "month",
          format: "M"
        },
        aggs: {
          top_hit_vl: {
            top_hits: {
              _source: false,
              size: 100
            }
          }
        }
      },
      annMonth: {
        date_histogram: {
          field: "anniversary",
          interval: "month",
          format: "M"
        },
        aggs: {
          top_hit_vl: {
            top_hits: {
              _source: false,
              size: 100
            }
          }
        }
      }
    }
  }
  let aggsQuery = {
    index: PERSON_INDEX,
    size: 0,
    body: query
  }
  const cachedHit = localStorage.getItem(key);
  if (cachedHit) {
    return JSON.parse(cachedHit);
  } else {
    try {
      let res = await callEs(aggsQuery)
      console.log("Aggs result", res);
      if (localStorage.length <= 10) {
        localStorage.setItem(key, JSON.stringify(res));
      }
      return res;
    }
    catch (err) {
      console.log("Error", err);
    }
  }
}


