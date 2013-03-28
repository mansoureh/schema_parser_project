var myGoogle = require('./myGoogle'),
    fs = require('fs');
    

myGoogle.resultsPerPage,
myGoogle.startIndicator,
myGoogle.experiment;


var searchDepth = 1,
    nextCounter = 1,
    pageCounter = 0,
    searchStartPage = 0;
    



var search_Items = [],
    searchItem;

var searchItemIdx = 0;


/** Read inputs from inputData.json **/
fs.readFile('inputData.json', 'utf8', function(error, filecontents) {
    if (error) console.log("Error in reading the file:  " + error);
    else {
        try {

            var content = JSON.parse(filecontents);
            
            search_Items = content.SearchItems;
            searchDepth = content.SearchDepth;
            searchStartPage = content.FromPage;
            
            /** 
             * searchDepth is number of searched urls:
             *   if user wants less than hundred urls in his/her search: 
             *              result per page will be the specified number.
             *   if user wants more than hundred urls in his/her search: 
             *              result per page will be 100 and the number of pages for getting urls will be calculated by Math.ceil(searchDepth/myGoogle.resultsPerPage):
             *              if (searchDepth = 120) pagecounter = 2
            **/
            if (searchDepth <= 10) {
                myGoogle.resultsPerPage = searchDepth;
            }
            else if (searchDepth > 10){
                myGoogle.resultsPerPage=10;
                pageCounter = Math.ceil(searchDepth/myGoogle.resultsPerPage);          
            }
            
            myGoogle.startIndicator = myGoogle.resultsPerPage;
            
              
            if (search_Items === "") console.log("You have not chosen any search item!");
            else {
               
                startSearchNewItem();
            }

        }
        catch (error) {
            console.log("The format of your input data is not correct!");
        }
    }

});


function resetVariables() {

    nextCounter = 1;
    if (searchDepth <= 10) {
        myGoogle.resultsPerPage = searchDepth;
    }
    else if (searchDepth > 10) {
        myGoogle.resultsPerPage = 10;
        pageCounter = Math.ceil(searchDepth / myGoogle.resultsPerPage);
    }

}


function startSearchNewItem() {
    if (searchItemIdx < search_Items.length) {
        resetVariables();
        searchItem = search_Items[searchItemIdx];
        myGoogle(searchItem, searchDepth * searchStartPage, myGoogleCallback);
    }
}


function myGoogleCallback(err, next, links) {
    if (err) {
        console.error("Error in mygoogle callback" + err);
    }

       
    insertTofile(links);
    
    if (nextCounter < pageCounter) {
            if (nextCounter == pageCounter - 1) {
                myGoogle.resultsPerPage = searchDepth - (nextCounter * myGoogle.resultsPerPage);
            }
            nextCounter += 1;
            if (next) next();
        }
    else {
        searchItemIdx++;
        startSearchNewItem();
    }
   
}



function insertTofile(links){
    
    var isUrlExist = false;
    
     if (links.length !== 0) {
         
        
        
        var listOfExistentUrls = fs.readFileSync('./urlsList.txt').toString().split("\n");
        
        for (var urlIndex = 0; urlIndex < links.length; urlIndex++) {
        
            for (var existentUrlIndex in listOfExistentUrls) {
                
                if(listOfExistentUrls[existentUrlIndex] == links[urlIndex].url)
                    isUrlExist = true;
            }
            
            if (!isUrlExist) {
                 var item1 = links[urlIndex].url+ "\n";
                 fs.appendFileSync("./urlsList.txt", item1 + "\n");
            }
            

        }
        console.log("done!");
    }

}

/** We do not save data in DB in this project
// function insertToDB(links) {
//     insertTofile(links);
// 
//     var db = new mongo.Db('googleResult', new mongo.Server('linus.mongohq.com', 10002, {
//         auto_reconnect: true
//     }), {
//         safe: false
//     });
//     db.open(function(err, db) {
//         db.authenticate("username", "password", function() {
//             var collection = new mongo.Collection(db, 'results');
//             for (var i = 0; i < links.length; i++) {
//                 collection.insert(links[i]);
//                 if (i === links.length - 1) {
//                     console.log("Done!");
// 
//                 }
//             }
//             collection.find().toArray(function(err, results) {
//                 
//                 db.close();
//             });
// 
//         });
// 
//     });
// }
**/
