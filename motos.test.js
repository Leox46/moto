const root = process.env.SERVER_URL || 'http://127.0.0.1:8080/api'
const fetch = require("node-fetch")
const motosRoot = root+'/motos'
const exampleMoto =  {
	"motoId": "5",
	"manufactor": "Yamaha",
	"model": "M1 2016",
	"displacement": 999.9,
	"power": 202.0
}
// importante per il TEST COVERAGE!
// const server = require('./server');

// helper methods - you can put these  in a separate file if you have many tests file and want to reuse them

const postMotos = function (newMoto) {
    return fetch(motosRoot, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newMoto)
    })
}

const putMotos = function (motoId, moto) {
    return fetch(motosRoot+'/'+motoId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(moto)
    })
}

const deleteMotos = function (motoId) {
    return fetch(motosRoot+'/'+motoId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
}


const getManyMotos = function () {
    return fetch(motosRoot, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
}

const getOneMoto = function (motoId) {
    return fetch(motosRoot+'/'+motoId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
}



test('basic post and get single element', () => {
  return postMotos(exampleMoto)
    .then(postResponse => { return postResponse.json() })
    .then(postResponseJson => {
      exampleMoto.motoId = postResponseJson.motoId
      return getOneMoto(exampleMoto.motoId)
    })
    .then(getResponse => {return getResponse.json()})
    .then(jsonResponse => {expect(jsonResponse.motoResult).toEqual(exampleMoto.motoResult)})
    //.catch(e => {console.log(e)})
});

// importante! Mettere la PUT prima della DELETE!
test('put item by motoId - basic response', () => {
  return putMotos(exampleMoto.motoId, exampleMoto)
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});

test('delete by motoId - basic response', () => {
  return deleteMotos(exampleMoto.motoId)
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});

test('get all motos - basic response', () => {
  return getManyMotos()
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});


/*
test('delete by assignmentID - item actually deleted', () => {
  return getOneAssignment(exampleAssignment.assignmentId)
    .then(res => {expect(res.status).toBe(404)})
    //.catch(e => {console.log(e)})
});
*/
