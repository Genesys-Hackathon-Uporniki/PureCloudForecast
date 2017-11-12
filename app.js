const platformClient = require('platformClient');
var client = platformClient.ApiClient.instance;
//client.setPersistSettings(true, 'optional_prefix');
var clientId = '1a469bb5-7bb7-4fa7-bf4e-6e90191223a8';
redirectUri = 'https://localhost:3000/' // encodeURIComponent(window.location.href);



let authStuff = async () => {
    let body = `
    {
        "interval": "2017-10-11T04:00:00.000Z/2017-11-12T05:00:00.000Z",
        "granularity": "P1D",
        "groupBy": [],
        "views": []
       }
    `;

    var apiInstance = new platformClient.AnalyticsApi();

    let data = await apiInstance.postAnalyticsConversationsAggregatesQuery(body);
    console.log(data);

    let json = {};
    let dataObj = {};

    let mediaTypeData = data.results.filter(function(item){
         return item.group.mediaType === 'email';
      })[0].data;

    mediaTypeData.forEach(element => {
        let keyDate = element.interval.split('/')[0];
        console.log(element);

        let valueStats = element.metrics.filter(function(item){
            return item.metric === 'tWait';
        })[0].stats;
        dataObj[keyDate] = valueStats;        
        
    });

    json['data'] = dataObj;
    json['predictDays'] = 7;
    json['politeMode'] = 'please';
    
    let url = 'http://localhost:8000/predictPlease';
    
    fetch(url, {
        method: 'post',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: json
      })
      .then(json)
      .then(function (data) {
        console.log('Request succeeded with JSON response', data);
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });

    
}



client.loginImplicitGrant(clientId, redirectUri)
    .then(function () {
        //alert('I am auth');
        authStuff();
    })
    .catch(function (response) {
        console.log(`${response.status} - ${response.error.message}`);
        console.log(response.error);
    });



// let data = fetch('https://ccforecast.herokuapp.com/')
//     .then(
//     response => {
//         if (response.status !== 200) {
//             console.log('Looks like there was a problem. Status Code: ' +
//                 response.status);
//             return;
//         }

//         // Examine the text in the response
//         response.json().then(data => {
//             console.log(data);
//             let paragraph = document.getElementById("data");
//             paragraph.innerHTML = data.success;
//         });
//     }
//     )
//     .catch(err => {
//         console.log('Fetch Error :-S', err);
//     });
