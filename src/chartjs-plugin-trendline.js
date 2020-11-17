/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: /npm/chartjs-plugin-trendline@0.2.2/src/chartjs-plugin-trendline.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/*!
 * chartjs-plugin-trendline.js
 * Version: 0.2.2
 *
 * Copyright 2020 Marcus Alsterfjord
 * Released under the MIT license
 * https://github.com/Makanz/chartjs-plugin-trendline/blob/master/README.md
 *
 * Mod by: vesal: accept also xy-data so works with scatter
 */
var pluginTrendlineLinear={id:"trendlineLinear",afterDraw:function(t){var e,i;for(var a in t.scales)if("x"==a[0]?i=t.scales[a]:e=t.scales[a],i&&e)break;var s=t.chart.ctx;t.data.datasets.forEach((function(e,a){if(e.trendlineLinear&&t.isDatasetVisible(a)&&0!=e.data.length){var n=t.getDatasetMeta(a);addFitter(n,s,e,i,t.scales[n.yAxisID])}})),s.setLineDash([])}};function addFitter(t,e,i,a,s){var n=i.trendlineLinear.style||i.borderColor,r=i.trendlineLinear.width||i.borderWidth,o=i.trendlineLinear.lineStyle||"solid";n=void 0!==n?n:"rgba(169,169,169, .6)",r=void 0!==r?r:3;var l=new LineFitter,d=i.data.length-1,h=t.data[0]._model.x,u=t.data[d]._model.x,m=!1;i.data&&"object"==typeof i.data[0]&&(m=!0),i.data.forEach((function(t,e){if(null!=t)if("time"===a.options.type){var i=null!=t.x?t.x:t.t;l.add(new Date(i).getTime(),t.y)}else m?l.add(t.x,t.y):l.add(e,t)}));var x=a.getPixelForValue(l.minx),c=a.getPixelForValue(l.maxx),f=s.getPixelForValue(l.f(l.minx)),g=s.getPixelForValue(l.f(l.maxx));m||(x=h,c=u);var p=t.controller.chart.chartArea.bottom,v=t.controller.chart.width;if(f>p){var X=f-p,L=f-g;f=p,x+=v*(X/L)}else if(g>p){X=g-p,L=g-f;g=p,c=v-(c-(v-v*(X/L)))}e.lineWidth=r,"dotted"===o&&e.setLineDash([2,3]),e.beginPath(),e.moveTo(x,f),e.lineTo(c,g),e.strokeStyle=n,e.stroke()}function LineFitter(){this.count=0,this.sumX=0,this.sumX2=0,this.sumXY=0,this.sumY=0,this.minx=1e100,this.maxx=-1e100}LineFitter.prototype={add:function(t,e){t=parseFloat(t),e=parseFloat(e),this.count++,this.sumX+=t,this.sumX2+=t*t,this.sumXY+=t*e,this.sumY+=e,t<this.minx&&(this.minx=t),t>this.maxx&&(this.maxx=t)},f:function(t){t=parseFloat(t);var e=this.count*this.sumX2-this.sumX*this.sumX;return(this.sumX2*this.sumY-this.sumX*this.sumXY)/e+t*((this.count*this.sumXY-this.sumX*this.sumY)/e)}},"undefined"!=typeof window&&window.Chart&&window.Chart.plugins.register(pluginTrendlineLinear);try{module.exports=exports=pluginTrendlineLinear}catch(t){}
//# sourceMappingURL=/sm/d6b4432e27b7095aeb41005a806f8d7fa1ef7f5847f01325d9792ece0fdc616b.map