import { Client } from 'elasticsearch';

const esClient = new Client({ host: "http://localhost:9200" })

export const callEs = async (query) => {
  try {
    let res = await esClient.search(query)
    return res;
  } catch (error) {
    console.log("Error", error)
  }

}

export const indexSchVl = async (query) => {
  try {
    let res = await esClient.search(query)
    return res;
  } catch (error) {
    console.log("Error", error)
  }
}