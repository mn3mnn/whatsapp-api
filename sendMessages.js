const { default: axios } = require("axios");
const { globalApiKey } = require("./config");

for (let i = 0; i < 5; i++) {    
    axios.post('http://20.203.97.197/api/send-message', {
        "content": `Hello world ${i}`,
        "mobile_number": "201097750807",
        "key": globalApiKey
    })
    .then((res) => {
        console.log(res)
    })
    .catch((error) => {
        console.error(error)
    })
}


// for (let i = 0; i < 10; i++) {    
//     axios.post('http://localhost:3000/api/send-message', {
//         "content": `Hello world ${i}`,
//         "mobile_number": "201129861466",
//         "key": globalApiKey
//     })
//     .then((res) => {
//         console.log(res)
//     })
//     .catch((error) => {
//         console.error(error)
//     })
// }