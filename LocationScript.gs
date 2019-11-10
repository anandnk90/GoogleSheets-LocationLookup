function locLookup(place, city, state) {

    //Replace SheetName with target sheet
    var SheetName = "Sheet6"
    var SS=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SheetName)

    var Ctr = 1
    //Company to be looked up on Google Maps expected in column A; Count number of company names to parse and lookup (in column A)
    var Avals = SS.getRange("A1:A").getValues();
    var numberOfValues = Avals.filter(String).length;

    //initialize for loop
    for(i = 0; i < numberOfValues; i++)
    {
      //process
      SS.getRange("F1").setValue(Ctr)

      //Company to be looked up on Google Maps expected in column A
      var CompanyName = SS.getRange("A"+Ctr).getValues();

      //Google Maps API key
      var API_KEY = '';
      var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' +
      CompanyName + '&key=' + API_KEY;
      var response = UrlFetchApp.fetch(url);
      var json = response.getContentText();
      obj = JSON.parse(json);
      try{
        placeId = obj.results[0].place_id;
        var url = 'https://maps.googleapis.com/maps/api/place/details/json?' +
          'placeid='+ placeId + '&fields=address_components&key=' +
          API_KEY;
        var response = UrlFetchApp.fetch(url);
        var json = response.getContentText();
        obj2 = JSON.parse(json);

        //City, State and Country are at different parts of JSON response, may have to be tweaked based on country
        city = obj2.result.address_components[1].short_name;
        state= obj2.result.address_components[3].short_name;
        country= obj2.result.address_components[4].short_name;
        SS.getRange("B"+Ctr).setValue(city)
        SS.getRange("C"+Ctr).setValue(state)
        SS.getRange("D"+Ctr).setValue(country)
        Ctr++
       }catch (e) {
        // Logs an ERROR message.
        console.error('locLookup() yielded an error: ' + e)
        //Set error in Column E
        SS.getRange("E"+Ctr).setValue(e)
        Ctr++
      }

    }
}
