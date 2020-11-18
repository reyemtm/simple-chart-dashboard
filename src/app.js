init()

function init() {

  const params = new URLSearchParams(window.location.search);
  const query = (!params || !params.get("county") || !params.get("state")) ? false : params.get("county");
  const state = (!params || !params.get("state")) ? false : params.get("state");
  const urlBase = "https://services9.arcgis.com/6Hv9AANartyT7fJW/ArcGIS/rest/services/USCounties_cases_V1/FeatureServer/0/query?where=";
  const url = (!query || !state) ?
  urlBase + `FIPS+IN+%2839119%2C39045,39093,39155,17031,54039%29${(!state) ? '' : `AND%20ST_Abbr='${state}'`}&outFields=*&f=pgeojson` : `${urlBase}Countyname='${query.charAt(0).toUpperCase() + query.slice(1)}'AND%20ST_Abbr='${(!state) ? "" : state}'&outFields=*&f=pgeojson`;
  
  console.log(query, state, url)

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.features.map(f => {
        document.body.querySelector("main").appendChild(createChart(f));
      });
      document.body.querySelector("main").style.opacity = 1;
      // localStorage.setItem("covid_data", JSON.stringify(data));
    });
  // } else {
  //   console.log("using local storage");
  //   const cached = JSON.parse(localStorage.getItem("covid_data"));
  //   cached.features.map(f => {
  //     document.body.querySelector("main").appendChild(createChart(f));
  //   });
  //   document.body.querySelector("main").style.opacity = 1;
  //   fetch(url)
  //   .then((res) => res.json())
  //   .then((data) => {
  //     if (data.features[0].properties.DateChecke != cached.features[0].properties.DateChecke || data.features.length != cached.features.length || data.features[0].properties.FIPS != cached.features[0].FIPS) {
  //       localStorage.setItem("covid_data", JSON.stringify(data));
  //       console.log('redrawing canvas')
  //       document.querySelector("main").innerHTML = "";
  //       data.features.map(f => {
  //         document.body.querySelector("main").appendChild(createChart(f));
  //       });
  //       document.body.querySelector("main").style.opacity = 1;
  //     }
  //   });
  // }
  
  function createChart(feature) {
    console.log(feature)
    const template = document.querySelector("template").content.cloneNode(true);
    const props = feature.properties;
    template.querySelector("h2").innerHTML = props.Countyname + " County, " + props.ST_Abbr 
    const details = template.querySelector(".js-details");
      details.innerHTML += `
        <h4>Cases: ${props.Confirmed.toLocaleString()}</h4>
        <h4>Deaths: ${props.Deaths.toLocaleString()}</h4>
        `
  
    const link = template.querySelector("a");
    link.href = (query && state) ? window.location.origin : window.location.origin + "/?county=" + props.Countyname + "&state=" + props.ST_Abbr;
    link.innerText = (query && state) ? "View All" : "Direct Link";
    link.style.opacity = 0.8;
  
    const cases = [];
    const chartData = [];
  
    Object.keys(props).forEach(p => {
      let value = props[p]
      if (p.toLowerCase().includes("day")) {
        cases.push(value)
      }
    })
  
    const values = []
    cases.map((v,i) => {
      if (i > 0 && i < cases.length -1) {
        values.push((v - cases[i+1]) / cases[i+1])
      }
    })

    const avg = values.reduce((a,b) => { return +a + b});
    details.innerHTML += `<h4 style="display:flex;">Trending${(avg > 0) ? '&nbsp;<img src="https://icongr.am/material/trending-up.svg?size=24&color=ec0404">' : '&nbsp;<img src="https://icongr.am/material/trending-down.svg?size=24&color=28bd14">'}&nbsp;${(avg * 100).toFixed(2)}%</h4>`;

    const sorted = cases
    const today = new Date(props.DateChecke);
    today.setHours(0, 0, 0)
  
    for (let i = 0; i < cases.length; i++) {
      let date = new Date(today);
      chartData.push({
        x: date.setDate(date.getDate() - i),
        y: sorted[i]
      })
    }
    // console.log(chartData)
    var ctx = template.querySelector("canvas").getContext("2d");
  
    var chartConfig = {
      datasets: [{
        label: "Cases",
        backgroundColor: "rgba(107,185,249, 0.5)",
        borderColor: "#6BB9F9",
        borderWidth: 2,
        // pointRadius: 0,
        pointHitRadius: 4,
        pointBorderColor: 'rgba(107,185,249, 0.8)',
        pointBackgroundColor: 'rgba(107,185,249, 0.5)',
        data: chartData,
        lineTension: 0.2,
        trendlineLinear: {
          style: "rgba(255,105,180, .8)",
          lineStyle: "dotted",
          width: 2
        }
      }]
    };
  
    let newChart = new Chart(ctx, {
      type: "line",
      data: chartConfig,
      options: {
        aspectRatio: 3,
        legend: false,
        scales: {
          xAxes: [{
            ticks: {
              fontColor: "rgba(107,185,249, 0.3)",
              // minRotation: 45,
              // maxRotation: 45
            },
            gridLines: {
              color: "rgba(107,185,249, 0.3)"
            },
            type: "time",
            time: {
              unit: "day"
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(107,185,249, 0.3)"
            },
            ticks: {
              fontColor: "rgba(107,185,249, 0.3)"
            }
          }]
        }
      }
    });
    return template
  }
  
  function lsTest() {
    var test = "test";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}
