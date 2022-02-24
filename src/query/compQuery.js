import { callEs } from './tsiteEs.js';

const COMPANY_INDEX = "companydomain_dev_new";



export const GetSuggesstion = async (qryStr) => {
  const source = ["cmpName"];
  let suggest = {
    suggest: {
      suggester: {
        prefix: qryStr,
        completion: {
          field: "cmpName.completion",
          skip_duplicates: true
        }
      }
    },
    sort: ['_score']
  }
  let queryBody = {
    index: COMPANY_INDEX,
    size: 0,
    _source:source,
    body: suggest
  }
  let res = await callEs(queryBody);
  if(res!== undefined){
    let result = res.suggest.suggester[0].options.map(h => h._source);
    return result;
  }  
  else{
    return ""
  }  
}

//To search company data full text search with aggregation
export const GetCompany = async (value) => {
  let queryAgg = {
    "query": {
      "simple_query_string": {
        "query": value + " | " + value + "* | "
      }
    },
    "aggs": {
      "categoryFilter": {
        "terms": {
          "field": "category.keyword"
        },
        "aggs": {
          "top_hit_vl": {
            "top_hits": {
              "_source": false
            }
          }
        }
      }
    },
    "highlight": {
      "fields": {
        "about": { "pre_tags": ["<mark>"], "post_tags": ["</mark>"] },
        "products": { "pre_tags": ["<mark>"], "post_tags": ["</mark>"] },
        "awards": { "pre_tags": ["<mark>"], "post_tags": ["</mark>"] },
        "jobs": { "pre_tags": ["<mark>"], "post_tags": ["</mark>"] },
        "news": { "pre_tags": ["<mark>"], "post_tags": ["</mark>"] },
        "faq": { "pre_tags": ["<mark>"], "post_tags": ["</mark>"] }
      }
    }
  }
  let result = callTsiteEsClient(queryAgg, 50, []);
  return result;
}

//To search company by name , country , state, postCode ,loc,domStatus,tags,pdom,status
export const GetCompByField = async (fieldNm, value) => {
  let schQuery = "";
  if (fieldNm === 'pDom') {
    schQuery = {
      query: {
        match: {
          "pDom.PK": {
            query: value
          }
        }
      }
    }
  } 
  else {
    schQuery = {
      query: {
        match: {
          [fieldNm]: {
            query: value
          }
        }
      }
    }
  }  
  let res = await callTsiteEsClient(schQuery,10,[]);
  if(res.hits.hits.length===0){
    let prefixRst = await GetCompByNamePrefixQry(value);
    if(prefixRst.hits.hits.length===0){
      let fuzzyRst = GetCompByNameFuzzyQry(value);
      return fuzzyRst;
    }else{
      return prefixRst;
    }    
  }else{
    return res;
  }  
}

// To get list of  companies with similar prefix
export const GetCompByNamePrefixQry = (compNm) => {
  let schQuery = {
    query: {
      prefix: {
        cmpName: {
          value: compNm,
          "case_insensitive": true
        }
      }
    }
  }
  let result = callTsiteEsClient(schQuery, 50, []);
  return result;
}

// To get list of  companies with Fuzzy Query
export const GetCompByNameFuzzyQry = (compNm) => {
  compNm = compNm.toLocaleLowerCase();
  let schQuery = {
    query: {
      fuzzy: {
        cmpName: {
          value: compNm,
          fuzziness: "AUTO",
          max_expansions: 10,
          prefix_length: 0
        }
      }
    }
  }
  let result = callTsiteEsClient(schQuery, 50, []);
  return result;
}

// Returns list of companies based on geo location range
export const GetCompaniesByGeoRange = (latVl,lonVl) =>{
  let geoQry = {
    query:{
      bool:{
        must:{
          match_all:{}
        },
        filter:{
          geo_distance:{
            distance:"10km",
            hqGeoLoc:{
              lat:latVl,
              lon:lonVl
            }
          }
        }
      }
    }
  }
  let result = callTsiteEsClient(geoQry,100,[]);
  return result;
}

// To get services of a company
export const GetServices = (compName) => {
  let schQry = {
    query: {
      match: {
        cmpName: {
          query: compName
        }
      }
    }
  }
  let source = ["services"];
  let result = callTsiteEsClient(schQry, 10, source);
  return result;
}

//Get company 

const callTsiteEsClient =  (schQuery, size, source) => {
  let query = {
    index: COMPANY_INDEX,
    _source: source,
    size: size,
    body: schQuery
  }
  try {
    let res =  callEs(query);
    console.log("res", res);
    return res;
  } catch (err) {
    console.log("Error", err);
  }
}