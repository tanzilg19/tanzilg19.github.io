$(function() {

    // Stock data
    var companies = [
        {
            name: 'Pink',
            symbol: 'PN',
            price: '5',
            shares: '0'
        },

        {
            name: 'Orange',
            symbol: 'OAG',
            price: '10',
            shares: '0'
        },

        {
            name: 'Green',
            symbol: 'GEN',
            price: '15',
            shares: '0'
        },

        {
            name: 'Red',
            symbol: 'RD',
            price: '20',
            shares: '0'
        },

        {
            name: 'Blue',
            symbol: 'BU',
            price: '25',
            shares: '0'
        },

        {
            name: 'Purple',
            symbol: 'PRL',
            price: '30',
            shares: '0'
        }
    ];

    // Section prices
    var sectionPrices = {
        'Pink': 40,
        'Orange': 60,
        'Green': 80,
        'Red': 100,
        'Blue': 120,
        'Purple': 140
    };

    // Function to update section prices in the table
    var updateSectionPrices = function() {
        for (var key in sectionPrices) {
            $('#' + key.toLowerCase() + 'SectionPrice').text('$' + sectionPrices[key]);
        }
    };

    // Call the function to update section prices initially
    updateSectionPrices();

    // Your cash flow
    var cashflow = 1000;

    /*
    - your portfolio value
    - calculates based on 
    current price of stocks
    and shares owned
    */

    var portfolioValue = function() {

        var total = 0;

        for (var key in companies) {
            var obj = companies[key];

            var symbol = '';
            var sharesOwned = 0;

            for (var prop in obj) {

                /*
                - grab the symbol value 
                - to use to make unique ids for tds
                */
                if (prop === 'symbol') {
                    symbol = obj[prop];
                }

                if (prop === 'price') {
                    //typecast string to float
                    var priceOfThisStock = parseFloat(obj[prop]);
                }

                if (prop === 'shares') {
                    //typecast string to float
                    var sharesOwned = parseFloat(obj[prop]);
                    total += priceOfThisStock * sharesOwned;
                }

            }
        }

        return total;
    };
    
    var changePrice = function(price) {
        // Define the minimum and maximum values for the price
    var minValue = 0;   // Adjust as needed
    var maxValue = 45; // Adjust as needed

        // Generate a random number 0 or 1
        var random = Math.round(Math.random());
        
        // If random is 0, subtract 5, else add 5
        if (random === 0) {
            price -= 5;
        } else {
            price += 5;
        }
        
        // Set price to zero if it would go below zero
        if (price < 0) {
            price = 45;
        }

        // Ensure the price stays within the defined range
    if (price < minValue) {
        price = minValue;
    } else if (price > maxValue) {
        price = maxValue;
    }
        
        return price;
    };
    


    // Build the table
    for (var key in companies) {
        var obj = companies[key];
        var symbol = '';
        var html = "<tr>";
        for (var prop in obj) {

            /*
            - grab the symbol value 
            - to use to make unique ids for tds
            */
            if (prop === 'symbol') {
                symbol = obj[prop];
            }

            // This will build the table dimensions
            if (prop !== 'price') {
                html += "<td id='" + prop + symbol + "'>";
                html += obj[prop];
                html += "</td>";
            } else {
                html += "<td id='" + prop + symbol + "'>";
                html += "<span class='price'>" + obj[prop] + "</span>";
                html += "</td>";
            }

            /*
            - if the td is price then add 
            the tds for Shares You own, 
            Buy and Sell buttons
            to the table row
            - manipulate the ids to be unique      
            */
            if (prop === 'shares') {
                html += "<td> <a href='#' class='buy' id='" + symbol + "Buy" + "'>buy 1 share</a> </td> <td> <a href='#' class='sell' id='" + symbol + "Sell" + "'>sell 1 share</a> </td>";
            }
        }
        // Add the section price
        html += "<td id='sectionPrice" + symbol + "'>$" + sectionPrices[obj['name']] + "</td>";
        html += "</tr>";
        $("#myPortfolio tbody").append(html);
    }

    // Every second do this
    setInterval(function() {

        /*
            - iterate through the stock data
            - change the price to a float
            - run the price through changePrice()
            - replace the new price into the stock data
            - replace the new price of the stock into the table
        */
        for (var key in companies) {
            var obj = companies[key];

            var symbol = '';

            for (var prop in obj) {

                /*
                - grab the symbol value 
                - to use to make unique ids for tds
                */
                if (prop === 'symbol') {
                    symbol = obj[prop];
                }

                if (prop === 'price') {
                    var priceOfThisStock = parseFloat(obj[prop]);
                    obj[prop] = changePrice(priceOfThisStock);


                    var roundedPrice = (obj[prop]).toFixed();
                    $('#' + prop + symbol).html("<span class='price'>" + roundedPrice + "</span>");
                }
            }
        }

    }, 15000 /* every second */ );


    // Every second do this
    setInterval(function() {
	calculatePrices();
    updatePrices();
	calculateSectionPrices();
    updateSectionPrices();

        /*
            - run cash flow, portfolio value, total worth functions
            and then put them in the dom
            - decide whether buy/sell buttons should appear 
            and then put them or remove them from the dom
        */
        for (var key in companies) {
            var obj = companies[key];

            //initialize 
            var symbol = '';
            var price = 0;
            var p = 0;
            var t = 0;

            for (var prop in obj) {

                /*
                - grab the symbol value 
                - to use to make unique ids for tds
                */
                if (prop === 'symbol') {
                    symbol = obj[prop];
                }

                p = portfolioValue();
                t = cashflow + p;

                $('#cashflow').html(cashflow);
                $('#portfolio').html(p);
                $('#netWorth').html(t);

                // Hide all buy buttons if cashflow is 0
                if (cashflow === 0) {
                    $('a').each(function() {
                        //grab the id of this link and typecast it to a string
                        var id = String($(this).attr('id'));

                        //if it contains buy hide it
                        if (id.indexOf('Buy') > 0) {
                            $(this).hide();
                        }
                    });
                }

                // Hide buy button if cashflow can't buy a share
                // Show buy button if cashflow can buy a share
                if (prop === 'price') {
                    price = parseFloat(obj[prop]);
                    if (cashflow < price) {
                        $('#' + symbol + 'Buy').hide();
                    } else {
						$('#' + symbol + 'Buy').show();
                    }

                }

                // Hide sell button if share isn't owned
                // Show sell button if share isn't owned
                if (prop === 'shares') {
                    var sharesOwned = parseFloat(obj[prop]);

                    if (sharesOwned > 0) {
                        $('#' + symbol + 'Sell').show();
                    } else {
                        $('#' + symbol + 'Sell').hide();
                    }
                }
            }
        }

    }, 1000 /* every 1000 milliseconds */);


    // Happens live
    $(document).on('click', "a", function() {

        // Grab the id of this link and typecast it to a string
        var id = String($(this).attr('id'));

        // If this is a buy button
        if (id.indexOf('Buy') > 0) {
            // Extract the symbol of the stock this is for
            symbol = id.substr(0, id.indexOf('Buy'));

            // Only do if cash flow is greater than share price 
            // Add a share 
            // Subtract share amount from cashflow

            // Initialize
            var thisObj = 0; // specific object in companies 

            for (var key in companies) {
                var obj = companies[key];

                for (var prop in obj) {

                    if (prop === 'symbol') {
                        if (obj[prop] === symbol) {

                            thisObj = key;
                        }
                    }

                    if (prop === 'price') {
                        if (key === thisObj) {
                            var PriceForThisStock = parseFloat(obj[prop]);

                            if (cashflow > PriceForThisStock) {
                                var subtractPrice = true;

                                // Since you bought a share we should 
                                // subtract the price of the share
                                // from your cashflow
                                cashflow = cashflow - PriceForThisStock;

                            }
                        }

                    }

                    if (prop === 'shares') {
                        if (key === thisObj) {

                            // If cash flow is greater than share price
                            if (subtractPrice) {
                                var sharesForThisStock = parseFloat(obj[prop]);

                                // Add 1 to the shares owned for this stock
                                sharesForThisStock += 1;

                                // And update the shares inside the companies array
                                obj[prop] = sharesForThisStock;

                                // And update the DOM
                                $('#' + 'shares' + symbol).html(sharesForThisStock);
                            }
                        }
                    }
                }
            }

        }

        // If this is a sell button
        if (id.indexOf('Sell') > 0) {

            // Extract the symbol of the stock this is for
            symbol = id.substr(0, id.indexOf('Sell'));

            // Only do if share of this stock is owned
            // Subtract a share
            // Add share amount to cash flow

            // Initialize
            var thisObj = 0; // specific object in companies 

            for (var key in companies) {
                var obj = companies[key];

                for (var prop in obj) {

                    if (prop === 'symbol') {
                        if (obj[prop] === symbol) {

                            thisObj = key;
                        }
                    }

                    if (prop === 'price') {
                        if (key === thisObj) {
                            var PriceForThisStock = parseFloat(obj[prop]);
                        }

                    }

                    if (prop === 'shares') {
                        if (key === thisObj) {

                            var sharesForThisStock = parseFloat(obj[prop]);

                            // If you own shares for this stock
                            if (sharesForThisStock) {

                                // Since you sold a share we should 
                                // add the price of the share
                                // to your cashflow
                                cashflow = cashflow + PriceForThisStock;

                                // Minus 1 to the shares owned for this stock
                                sharesForThisStock -= 1;

                                // And update the shares inside the companies array
                                obj[prop] = sharesForThisStock;

                                // And update the DOM
                                $('#' + 'shares' + symbol).html(sharesForThisStock);
                            }
                        }
                    }

                }
            }
        }

        // Act like a button not a link
        return false;

    });

});

