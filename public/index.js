
var timer = null;
var previousUsdPrice = 0;
var usdPrice = 0;
var eurPrice =0;
var gbpPrice = 0;

//force data to load completly before modifying
$(document).ready(function() {

  if (document.URL.indexOf("#") == -1) {
    url = document.URL + "#loaded";
    location = "#loaded";
    location.reload(true);

  }
tickerAutoReloader(15);

  $("#dark-mode-toggle").change(function() {
    if (document.querySelector("#dark-mode-toggle").checked == true) {
      document.querySelector(".css-styles").href = "../drkStyles.css";
    } else {
      document.querySelector(".css-styles").href = "../styles.css";
    }
  })

  $("#sec-15").change(function() {
    var seconds = parseFloat(($("#sec-15").val()));
    clearTimeout(timer);
    tickerAutoReloader(seconds);
  });

  $("#sec-30").change(function() {
    var seconds = parseFloat(($("#sec-30").val()));
    clearTimeout(timer);
    tickerAutoReloader(seconds);

  });

  $("#sec-60").change(function() {
    var seconds = parseFloat(($("#sec-60").val()));
    clearTimeout(timer);
    tickerAutoReloader(seconds);
  });

  function reloadTickersFromAPI() {
    var currentPriceUrl = "http://api.coindesk.com/v1/bpi/currentprice.json";
    //Get the current prices
    $.ajax({
      method: "GET",
      url: currentPriceUrl,
    })
    .done(function(res){

      if(typeof res === 'string'){
        var currentPriceObject = JSON.parse(res);
      }else{
        var currentPriceObject = res;
      }

      usdPrice = currentPriceObject.bpi.USD.rate;
      eurPrice = currentPriceObject.bpi.EUR.rate;
      gbpPrice = currentPriceObject.bpi.GBP.rate;

      var ticker = findCurrentPriceTick(previousUsdPrice,usdPrice);
      if(ticker=='▲'){
        $("#usd-ticker-price").css("color","green");
      }else if(ticker=='▼'){
        $("#usd-ticker-price").css("color","#C70039");
      }else $("#usd-ticker-price").css("color","black");

      $("#usd-ticker-price").text(usdPrice + ticker);
      $("#eur-ticker-price").text(eurPrice);
      $("#gbp-ticker-price").text(gbpPrice);

    })
    .fail(function(){
      console.log("fail");
    });
    previousUsdPrice = usdPrice;

  }

  function findCurrentPriceTick(previousPrice,currentPrice){

      if(currentPrice>previousPrice){
        console.log(currentPrice+" "+previousPrice);
        tick = '▲';
    } else if(currentPrice<previousPrice){
        tick = '▼';
    } else tick = '';
    return tick;

  }

  function tickerAutoReloader(seconds) {
    reloadTickersFromAPI();
    console.log("reloadedTickers after " + seconds + " seconds");
    timer = setTimeout(function() {
      tickerAutoReloader(seconds)
    }, (seconds * 1000));
  };

});
