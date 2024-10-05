const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const fs = require('fs');

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var weekPrices = [0,0,0,0,0,0,0];
var priceGraphProportions=[0,0,0,0,0,0,0];
var weekDates = [0,0,0,0,0,0,0];

const bpiHistPriceURL = "http://api.coindesk.com/v1/bpi/historical/close.json";

app.get("/",function(req,res){

//GET HISTORICAL PRICES
http.get(bpiHistPriceURL,function(histresponse){

//Buffer in chunks to avoid unexpected end error
  var chunks = [];
  histresponse.on('data',function(data){
    chunks.push(data);}).on('end',function() {
      var data = Buffer.concat(chunks);
      var histPriceData = JSON.parse(data);

      var histPriceArr = Object.values(histPriceData.bpi);
      var histDatesArr = Object.keys(histPriceData.bpi);

      //pull and set weekprices & dates from histPriceData api object
      count=24;
      for(i=0;i<7;i++){
        weekPrices[i] = Math.round(histPriceArr[count]/1000);
        weekDates[i] =splitAndFormatDate(histDatesArr[count]);
        priceGraphProportions[i] =(weekPrices[i].toString())[1];
        count++;
      }

      res.render('index',{
        day1Price:weekPrices[0],tuesPrice:weekPrices[1],wedPrice:weekPrices[2],thursPrice:weekPrices[3],
        friPrice:weekPrices[4],satPrice:weekPrices[5],sunPrice:weekPrices[6],
        pGP1:priceGraphProportions[0],pGP2:priceGraphProportions[1],pGP3:priceGraphProportions[2],
        pGP4:priceGraphProportions[3],pGP5:priceGraphProportions[4],pGP6:priceGraphProportions[5],
        pGP7:priceGraphProportions[6],
        day1:weekDates[0],day2:weekDates[1],day3:weekDates[2],day4:weekDates[3],day5:weekDates[4],day6:weekDates[5],day7:weekDates[6]});
  });
});

});

function splitAndFormatDate(date){
  var day = date.substring(7,9);
  var mon = date.substring(8,11);
  if(date.substring(5,6)==0){day = date.substring(6,7);}
  if(date.substring(8,9)==0){mon = date.substring(9,10);}

  formDate = day+"/"+mon
  return formDate;
}

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
