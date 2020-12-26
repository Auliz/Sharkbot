const fetch = require('node-fetch');
const jokes = {
  joke: '',
};

const objReq = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};
const url = 'https://icanhazdadjoke.com/';

let fetchDataFromApi = async () => {
  let response = await fetch(url, objReq);
  let result = await response.json();
  return result;
};

async function caller() {
  const json = await fetchDataFromApi();
  jokes.joke = json.joke;
  console.log(jokes.joke);
}
caller();
