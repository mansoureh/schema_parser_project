var fs = require("fs"),
    async = require('async'),
    jsdom = require("jsdom"),
    schemaTypeValidation = require('schema.org-type-validator'),
    validator = new schemaTypeValidation.Validator();


var numberOfUrls = fs.readFileSync('./urlsList.txt').toString().split('\n').length,
    urlIndex = 0,
    fileNameCounter = 0;
   

getURLFromFile();

/**
  getURLFromFile function provides a list of urls we want to extract their schema.org markups.

*/
function getURLFromFile() {
    
    if(urlIndex < numberOfUrls ){
    
    //fs.readFileSync('./urlsList.txt').toString().split('\n').forEach(function(line) {
        var line = fs.readFileSync('./urlsList.txt').toString().split('\n')[urlIndex];
        if (line !== "") {
            fileNameCounter++;
            console.log(line);
            parseSchemaOrg(line);
        }
        else {
            urlIndex++;
            getURLFromFile(urlIndex);
        }
    }
}


var schemaArray = [],
    arrayItems = {};

var currentItemtype = "",
    currentItemprop = "",
    currentItemid = "",
    dependentNode = false,
    nestedInNode = false,
    orphanedNode = false,
    rootNode = false,
    isExpectedType = false,
    intelligibleType = false,
    aloneItemscope = false,
    intelligibleProperty = false;


var isTheLastItemtype = false;
var isTheLastItemprop = false;


var url = "",
    subject = "",
    node = "";

var blankNodeCounter_b = 0,
    blankNodeCounter_e = 0,
    blankNodeCounter_s = 0,
    blankNodeCounter_o = 0;

var numberOfItemtypesInURL ="",
    numberOfItempropsInURL="";
    
    
  

function parseSchemaOrg(URL, cb) {

    schemaArray = [],
    arrayItems = {},
    currentItemtype = "",
    currentItemprop = "",
    currentItemid = "",
    dependentNode = false,
    nestedInNode = false,
    orphanedNode = false,
    rootNode = false,
    isExpectedType = false,
    intelligibleType = false,
    aloneItemscope = false,
    intelligibleProperty = false;


    isTheLastItemtype = false;
    isTheLastItemprop = false;


    url = "",
    subject = "",
    node = "";

    blankNodeCounter_b = 0,
    blankNodeCounter_e = 0,
    blankNodeCounter_s = 0,
    blankNodeCounter_o = 0;

    numberOfItemtypesInURL = "",
    numberOfItempropsInURL = "";
    
    
    
   
    //jsdom.env("html.html", ["http://code.jquery.com/jquery.js"],
    jsdom.env(URL, ["http://code.jquery.com/jquery.js"],
    //jsdom.env("http://www.cafepress.com/+obama+gifts", ["http://code.jquery.com/jquery.js"],
    
    

    function(errors, window) {

        if (errors) {
            console.error("# ERROR : " + errors);
            urlIndex++;
            getURLFromFile();
        }
        else {
            var $ = window.$;
            url = URL;

            blankNodeCounter_b = 0,
            blankNodeCounter_e = 0,
            blankNodeCounter_s = 0;
            blankNodeCounter_o = 0;

            numberOfItemtypesInURL = $($.find("[itemtype]")).length;
            numberOfItempropsInURL = $($.find("[itemprop]")).length;

            /** 
         * To parse the url and get all schema.org markup it is necessary to:
            * 1- Get all nodes with itemtype attributes in the page.
            * 2- For each one:
            
                    * 2-1: Check if it is schema.org type(it should be itemtype="http://schema.org/+ SOMETHING").      
                    * 2-2: Check if it is 
                                       * 2-2-1: A rootNode (a node with itemtype attr and without itemprop attr which is not situated inside any node With itemtype attr above):
                                                 * 2-2-1-1: Check if it is intelligible/unintelligible type for schema.org.
                                                 * 2-2-1-2: Check if it is itemid attribute for the node.
                                                 
                                                 
                                       * 2-2-2: A nestedIn node (a node with itemtype attr and without itemprop attr which is situated in another node with itemtype attr above):
                                                 * 2-2-2-1: Check if it is intelligible/unintelligible type for schema.org.
                                                 * 2-2-2-2: Check if it is itemid attribute for the node.
                                                 * 2-2-2-3: Get all properties of current schema.org type.
                                                 
                                       * 2-2-3: A dependant node (a node with itemtype and itemprop attr which is situated in another node with itemtype attr above):
                                                 * 2-2-3-1: Check if it is intelligible/unintelligible type for schema.org.
                                                            * 2-2-3-1-1: Intelligible Type: 
                                                                        * 2-2-3-1-1-a: Check if the property is intelligible:
                                                                                        * 2-2-3-1-1-a-1: Check if if the type is an expected/unexpected type for property. 
                                                                                        
                                                                        * 2-2-3-1-1-b: Check if the property is unintelligible.
                                                                        
                                                            * 2-2-3-1-2: Unintelligible Type. 
                                                            
                                                 * 2-2-3-2: Check if it is itemid attribute for the node.
                                                 
                                                 
                                       * 2-2-4: An orphaned/ dependant node (a node with itemtype and itemprop attrs which is not situated inside any node With itemtype attr above):
                                                 * 2-2-4-1: Check if there is not any node with alone itemscope attr (without itemtype attr) above the current node as a parent.
                                                         * 2-2-4-1-1: Check if it is intelligible/unintelligible type for schema.org.
                                                         
                                                                        * 2-2-4-1-1-a: Intelligible Type: 
                                                                        
                                                                                      * 2-2-4-1-1-a-1: Check if the property is intelligible:
                                                                                                     * 2-2-4-2-1-a-1-1: Check if if the type is an expected/unexpected type for property. 
                                                                                        
                                                                                      * 2-2-4-1-1-a-2: Check if the property is unintelligible.
                                                                        
                                                                        * 2-2-4-1-1-b: Unintelligible Type:
                                                                        
                                                                                      * 2-2-4-1-1-b-1: Check if the property is intelligible.
                                                                                      * 2-2-4-1-1-b-2: Check if the property is unintelligible.
                                                         
                                                 * 2-2-4-2: Check if there is a node with alone itemscope attr (without itemtype attr) above the current node as a parent.
                                                          * 2-2-4-2-1: Check if it is intelligible/unintelligible type for schema.org.
                                                         
                                                                        * 2-2-4-2-1-a: Intelligible Type: 
                                                                        
                                                                                      * 2-2-4-2-1-a-1: Check if the property is intelligible:
                                                                                                     * 2-2-4-2-1-a-1-1: Check if if the type is an expected/unexpected type for property. 
                                                                                        
                                                                                      * 2-2-4-2-1-a-2: Check if the property is unintelligible.
                                                                        
                                                                        * 2-2-4-2-1-b: Unintelligible Type:
                                                                        
                                                                                      * 2-2-4-2-1-b-1: Check if the property is intelligible.
                                                                                      * 2-2-4-2-1-b-2: Check if the property is unintelligible.
                                                                                      
                                                                                  
                                                 * 2-2-4-3: Check if it is itemid attribute for the node.
                                                 
                    * Check for missing Itemscope                             
                    * 2-3: Get all properties of current node.                            
                                                 
            * 3- Get Properties:
                    * 3-1: Alone property: A node with itemprop attr without any itemtype attr:
                            * 3-1-1: Check if it is intelligible/unintelligible property for schema.org. 
                                     * 3-1-1-1: Intelligible Property:
                                                * 3-1-1-1-1: Check if it is a valid/invalid property for its parent's type.
                                     * 3-1-1-2: Unintelligible Property.
                    * 3-2: Property and Type together: A node with itemprop attr and itemtype attr:
                            * 3-2-1: Check if it is intelligible/unintelligible property for schema.org. 
                                     * 3-2-1-1: Intelligible Property:
                                                * 3-1-1-1-1: Check if it is a valid/invalid property for its parent's type.
                                     * 3-2-1-2: Unintelligible Property.
                                    
                    * 3-3: Check if there is at least one property for the parent node with itemtype attr.                
                                    
                                    
             * 4- Get Orphaned Properties: A node with itemprop attrs which is not situated inside any node With itemtype attr above:
                     
                             * 3-4-1: Check if there is not any node with alone itemscope attr (without itemtype attr) above the current node as a parent.
                             
                                      * 3-4-1-1: Check if the property is intelligible.
                                      * 3-4-1-2: Check if the property is unintelligible.
                                                   
                             * 3-4-2: Check if there is a node with alone itemscope attr (without itemtype attr) above the current node as a parent.
                                      * 3-4-2-1: Check if the property is intelligible.
                                      * 3-4-2-2: Check if the property is unintelligible.            
                         
        */

            /** 1- Get all nodes with itemtype attributes of url: */
            parseNode($, 0, cb);
        }
    });
}

function parseNode($, itemtypeIndex, _cb) {
    if (itemtypeIndex < numberOfItemtypesInURL) {
        
        dependentNode = false,
        nestedInNode = false,
        orphanedNode = false,
        rootNode = false,
        isExpectedType = false,
        intelligibleType = false,
        intelligibleProperty = false,
        aloneItemscope = false;
        subject = "",
        node = $.find("[itemtype]")[itemtypeIndex],
        currentItemtype = $(node).attr("itemtype"),
        currentItemid = $(node).attr("itemid"),
        currentItemprop = "";

        /** 2-1: Check if it is schema.org type(it should be itemtype="http://schema.org/+ SOMETHING").*/
        if (currentItemtype.match("http://schema.org/")) {

            async.waterfall([
            
            function(cb) {
                /** Check for intelligibility/unintelligibility of itemtype*/
                validator.checkIsValidTypeInSchema(currentItemtype, function(err, result) {
                    
                    if (result) {
                        intelligibleType = true;
                        
                        cb();
                    }
                    else if (!result) {
                        intelligibleType = false;
                       
                        cb();
                    }
                    else if (err) {
                        
                        console.log(err);
                    }

                });
                
            },

            function(cb) {
                
                checkTypeOfNode($, node, function(){
                    
                    cb();
                });
                
                
            },

            function(cb) {
                buildTriples($, node);
                cb();
            },
            function(cb) {
                
                if(currentItemid)
                    getItemIdAttr(currentItemid, subject);
                if(!$(node).is('[itemscope]'))
                    missingItemscope(currentItemtype, subject);    
                cb();
            },
            

            function(cb) {
                
                /**  2-3: Get all properties of current node. */
                getAllProperties($, $(node), subject, intelligibleType, function()  {
                    cb();
                });
            },
            

            function(cb) {
                
                itemtypeIndex++;
                parseNode($, itemtypeIndex);
            },

            ]);


        }
        else {
            itemtypeIndex++;
            parseNode($, itemtypeIndex);
        }
    }
    else {

        isTheLastItemtype = true;
        /** 4- Get Orphaned Properties: */
        getOrphanedProperties($,0);

    }
}
      
      
/** 2-2: Check the type of node: ?(rootNode, nestedIn, Dependent, Orphaned) */

function checkTypeOfNode($,element, callback) {
   
    var currentNodeParents = $(element).parent().closest("[itemtype*='http://schema.org']");
    
    var pureItemtype = "";
    if (currentNodeParents.attr("itemtype")) /** There is a parent for the node. check for nestedIn or dependant form of node*/
    {
        
        if ($(element).attr("itemprop")) /** Dependent form of node */
        {
        
            dependentNode = true;
            currentItemprop = $(element).attr("itemprop");
        
        
            async.waterfall([
            
            function(cb) {
                /** Check the intelligibility of current node itemprop :*/
                validator.checkIsValidPropertyInSchema('http://schema.org/' + currentItemprop,

                function(err, result) {
                   
                    if (result) {
                        intelligibleProperty = true;
                        cb();
                    }
                    else if (!result) {
                        intelligibleProperty = false;
                        cb();
                    }
                    else if (err) {
                        
                        console.log(err);
                    }
                });


                
            },
        
            function(cb) {
                /** Check the expectability of current node itemtype for itemprop:(if type and property have been intelligible)*/
                /** 
                    itemtype is like: http://schema.org/Person. To use it in the  
                    validator it is necessary to delete the first part (http://schema.org/).
                */
                if (intelligibleType && intelligibleProperty) {
                    pureItemtype = currentItemtype.substring(currentItemtype.lastIndexOf("/") + 1);
                    validator.checkIsExpectedType(currentItemprop, pureItemtype,

                    function(err, result) {
                       
                        if (result) {
                            isExpectedType = true;
                            callback();
                        }
                        else if (!result) {
                            isExpectedType = false;
                            callback();
                            
                        }
                        else if (err) {
                            
                            
                            console.log(err);
                        }
                    });
                }
                
            },
            ]);

        }
        if (!$(element).attr("itemprop")) /** NestedIn form of node */
        {
            
            nestedInNode = true;
             callback();
           
        }
    }
    else /*There is not any parent for the node. check for rootNode or orphaned form of node*/
    {
        
        if ($(element).attr("itemprop")) /** Orphaned form of node */
        {
            orphanedNode = true;
            if ($(element).parent().closest("[itemscope]") && !$(element).parent().closest("[itemstype]"))
                aloneItemscope = true;
                
            

            currentItemprop = $(element).attr("itemprop");



            async.waterfall([
            
            function(cb) {
                /** Check the intelligibility of current node itemprop :*/
                validator.checkIsValidPropertyInSchema('http://schema.org/' + currentItemprop,
                
                function(err, result) {
                    
                    if (result) {
                        intelligibleProperty = true;
                        cb();
                    }
                    else if (!result) {
                        intelligibleProperty = false;
                        cb();
                    }
                    else if (err) {
                        
                        console.log(err);
                    }
                });
    
            },
        
            function(cb) {
                /** Check the expectability of current node itemtype for itemprop:(if type and property have been intelligible)*/
                /** 
                    itemtype is like: http://schema.org/Person. To use it in the  
                    validator it is necessary to delete the first part (http://schema.org/).
                */
                if (intelligibleType && intelligibleProperty) {
                    pureItemtype = currentItemtype.substring(currentItemtype.lastIndexOf("/") + 1);
                    validator.checkIsExpectedType(currentItemprop, pureItemtype,

                    function(err, result) {
                        if (result) {
                            isExpectedType = true;
                             callback();
                            }
                        else if (!result) {
                            isExpectedType = false;
                             callback();
                            }
                        else if (err) {
                            
                            console.log(err);
                        }
                    });
                }
                
            }, ]);
       
        }
        if (!$(element).attr("itemprop")) /** RootNode form of node */
        {
            
            rootNode = true;
            callback();
            
        }
    }
}

function buildTriples($,element) {

   
    /** 2-2-1-1 */
    if (rootNode && intelligibleType) {
     
        /**
         * <bi> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
         * <bi> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <itemtype>
         */
        subject = "<b" + blankNodeCounter_b + ">";
        blankNodeCounter_b++;
        

        arrayItems = {
            subjectForFurtherUse: '',
            node: "",
            subject: subject,
            predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
            object: url,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        arrayItems = {
            subjectForFurtherUse: subject,
            node: $(element),
            subject: subject,
            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
            object: currentItemtype,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);
    }
    else if (rootNode && !intelligibleType) {
        /**
         * <bi> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
         * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType> 
         * <ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
         * <bi> <ek> <bi.k>
         */

        arrayItems = {
            subjectForFurtherUse: '',
            node: '',
            subject: "<b" + blankNodeCounter_b + ">",
            predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
            object: url,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        arrayItems = {
            subjectForFurtherUse: '',
            node: '',
            subject: "<e" + blankNodeCounter_e + ">",
            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
            object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        arrayItems = {
            subjectForFurtherUse: '',
            node: '',
            subject: "<e" + blankNodeCounter_e + ">",
            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
            object: currentItemtype,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        subject = "<b" + blankNodeCounter_b + '.' + blankNodeCounter_e + ">";
        arrayItems = {
            subjectForFurtherUse: subject,
            node: $(element),
            subject: "<b" + blankNodeCounter_b + ">",
            predicate: "<e" + blankNodeCounter_e + ">",
            object: subject,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        blankNodeCounter_b++;
        blankNodeCounter_e++;

    }

    /** 2-2-2-1 */
    if (nestedInNode) {

        /**
         * As we need to find the parent node subject for the relation:
         *     We got the closest node with itemtype attr which is matched to schema.org:
         */
        var connectionToParent = "";

        for (var i = 0; i < schemaArray.length; i++) {

            if ($(schemaArray[i].node).is($(element).parent().closest("[itemtype*='http://schema.org']"))) {
                connectionToParent = schemaArray[i].subjectForFurtherUse;
            }
        }

        if (intelligibleType) {
            /**
             * <bi> <http://www.redhat.com/2013/schema-parser#nestedIn> <bi-1> ---<b.parent>
             * <bi> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <itemtype>
             */
            subject = "<b" + blankNodeCounter_b + ">";
            blankNodeCounter_b++;

            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: subject,
                predicate: "<http://www.redhat.com/2013/schema-parser#nestedIn>",
                object: connectionToParent,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: subject,
                node: $(element),
                subject: subject,
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: currentItemtype,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);
        }
        else if (!intelligibleType) {
            /**
             * <bi> <http://www.redhat.com/2013/schema-parser#nestedIn> <bi-1>
             * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType> 
             * <ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
             * <bi> <ek> <bi.k>
             */

            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<b" + blankNodeCounter_b + ">",
                predicate: "<http://www.redhat.com/2013/schema-parser#nestedIn>",
                object: connectionToParent,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<e" + blankNodeCounter_e + ">",
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<e" + blankNodeCounter_e + ">",
                predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                object: currentItemtype,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            subject = "<b" + blankNodeCounter_b + "." + blankNodeCounter_e + ">";
            arrayItems = {
                subjectForFurtherUse: subject,
                node: $(element),
                subject: "<b" + blankNodeCounter_b + ">",
                predicate: "<e" + blankNodeCounter_e + ">",
                object: subject,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            blankNodeCounter_b++;
            blankNodeCounter_e++;
        }
    }

    /** 2-2-3-1 */
    if (dependentNode) {
        
       
        /**
         * As we need to find the parent node subject for the relation:
         *     We got the closest node with itemtype attr which is matched to schema.org:
         */

        for (var j = 0; j < schemaArray.length; j++) {

             // if ($(schemaArray[j].node).is($(element).parent().closest("[itemtype*='http://schema.org']")) && schemaArray[j].objectForFurtherUse !== '') {
              if ($(schemaArray[j].node).is($(element)) && schemaArray[j].objectForFurtherUse !== '') {
                subject = schemaArray[j].objectForFurtherUse;
            }
        }

        /** 2-2-3-1-1-a && 2-2-3-1-1-b */
        if ((intelligibleType && intelligibleProperty && isExpectedType) || (intelligibleType && !intelligibleProperty)) {
            /**
             * <si>(objectForFurtherUse) <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <itemtype>
             */
            
            arrayItems = {
                subjectForFurtherUse: subject,
                node: $(element),
                subject: subject,
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: currentItemtype,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

        }

        else if (intelligibleType && intelligibleProperty && !isExpectedType) {
            
            
            /**
             * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#notExpectedType>
             * <ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
             * <si>(objectForFurtherUse) <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <ek>
             */
            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<e" + blankNodeCounter_e + ">",
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: "<http://www.redhat.com/2013/schema-parser#notExpectedType>",
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<e" + blankNodeCounter_e + ">",
                predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                object: currentItemtype,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: subject,
                node: $(element),
                subject: subject,
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: "<e" + blankNodeCounter_e + ">",
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            blankNodeCounter_e++;
        }


        /** 2-2-3-1-2 */

        else if (!intelligibleType) {
            /**
             * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType>
             * <ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
             * <si>(objectForFurtherUse) <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <ek>
             */
            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<e" + blankNodeCounter_e + ">",
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<e" + blankNodeCounter_e + ">",
                predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                object: currentItemtype,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: subject,
                node: $(element),
                subject: subject,
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: "<e" + blankNodeCounter_e + ">",
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            blankNodeCounter_e++;
        }

    }

    /** 2-2-4 */
    if (orphanedNode) {

        /** 2-2-4-1 */
        if (!aloneItemscope && intelligibleType) {
            if (intelligibleProperty && isExpectedType) {
                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <N0> <itemprop> <s0>
                 * <s0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <itemtype>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://schema.prg/" + currentItemprop+">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;

            }
            else if (intelligibleProperty && !isExpectedType) {

                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <N0> <itemprop> <s0>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#notExpectedType>
                 * <ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
                 * <s0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <ek>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://schema.prg/" + currentItemprop+">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#notExpectedType>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<e" + blankNodeCounter_e + ">",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }
            else if (!intelligibleProperty) {

                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                 * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop>
                 * <N0> <ek> <sj>
                 * <sj> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <itemtype>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                    object: "http://schema.prg/" + currentItemprop,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<e" + blankNodeCounter_e + ">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }
        }
        else if (!aloneItemscope && !intelligibleType) {
            if (intelligibleProperty) {
                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <N0> <itemprop> <sj>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType>
                 * <ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
                 * <s0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <ek>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://schema.prg/" + currentItemprop+">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<e" + blankNodeCounter_e + ">",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;
            }
            else if (!intelligibleProperty) {
                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                 * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop>
                 * <N0> <ek> <sj>
                 * <ek+1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType>
                 * <ek+1> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
                 * <s0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <ek+1>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                    object: "http://schema.prg/" + currentItemprop,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<e" + blankNodeCounter_e + ">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                blankNodeCounter_e++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<e" + blankNodeCounter_e + ">",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }
        }

        /** 2-2-4-2 */
        else if (aloneItemscope && intelligibleType) {
            
           
            if (intelligibleProperty && isExpectedType) {
                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>
                 * <N0> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop>
                 * <N0> <ek> <sj>
                 * <sj> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <itemtype>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                    object: "http://schema.prg/" + currentItemprop,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<e" + blankNodeCounter_e + ">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }
            else if (intelligibleProperty && !isExpectedType) {
                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>
                 * <N0> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop>
                 * <N0> <ek> <sj>
                 * <ek+1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#notExpectedType>
                 * <ek+1> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
                 * <sj> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <ek+1>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                    object: "http://schema.prg/" + currentItemprop,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<e" + blankNodeCounter_e + ">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                blankNodeCounter_e++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#notExpectedType>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<e" + blankNodeCounter_e + ">",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }
            else if (!intelligibleProperty) {

                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>
                 * <N0> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                 * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop>
                 * <N0> <ek> <sj>
                 * <sj> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <itemtype>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                    object: "http://schema.prg/" + currentItemprop,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<e" + blankNodeCounter_e + ">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }

        }
        else if (aloneItemscope && !intelligibleType) {
            if (intelligibleProperty) {
                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>
                 * <N0> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop>
                 * <N0> <ek> <sj>
                 * <ek+1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType>
                 * <ek+1> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
                 * <sj> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <ek+1>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                    object: "http://schema.prg/" + currentItemprop,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<e" + blankNodeCounter_e + ">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                blankNodeCounter_e++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<e" + blankNodeCounter_e + ">",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }
            else if (!intelligibleProperty) {
                /**
                 * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>
                 * <N0> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                 * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop>
                 * <N0> <ek> <sj>
                 * <ek+1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType>
                 * <ek+1> <http://www.redhat.com/2013/schema-parser#specifiedType> <itemtype>
                 * <sj> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <ek+1>
                 */

                subject = "<s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                    object: "http://schema.prg/" + currentItemprop,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<N" + blankNodeCounter_o + ">",
                    predicate: "<e" + blankNodeCounter_e + ">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                blankNodeCounter_e++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                    object: currentItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<e" + blankNodeCounter_e + ">",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;
            }
        }
    }
}

function getItemIdAttr(currentItemid, subject) {

    var subUrl = url;
    if (url.lastIndexOf("/") === url.length - 1) subUrl = subUrl.substring(0, subUrl.length - 1);
    if (currentItemid.indexOf("www") === -1) currentItemid = subUrl + currentItemid;
    arrayItems = {
        node: "",
        subject: subject,
        predicate: "<http://www.w3.org/2002/07/owl#sameAs>",
        object: currentItemid,
    };
    schemaArray.push(arrayItems);
}

function missingItemscope(currentItemtype, subject) {
    arrayItems = {
        node: "",
        subject: subject,
        predicate: "<http://www.redhat.com/2013/schema-parser#missingItemScope>",
        object: currentItemtype,
    };
    schemaArray.push(arrayItems);
}

function getOrphanedProperties($, itempropIndex) {
   
            if (itempropIndex < numberOfItempropsInURL) {

                 var orphanedNode = $.find("[itemprop]")[itempropIndex],
                        orphanedProp = $(orphanedNode).attr("itemprop"),
                        intelligibleOrphanedProperty = false,
                        isOrphanedProp = false,
                        isOrphanedPropWithoutItemscope = false,
                        itempropValue = "";

                    
                    if (!$(orphanedNode).attr("itemtype") || ($(orphanedNode).attr("itemtype") && !$(orphanedNode).attr("itemtype").match("http://schema.org/"))) {
                        
                        
                        var parents = $(orphanedNode).parents("[itemtype*='http://schema.org']");
                        if (parents.length === 0) {
                            isOrphanedProp = true;
                        
                            async.waterfall([

                            function(callback) {
                                /** Check the intelligibility of current node itemprop :*/
                                validator.checkIsValidPropertyInSchema('http://schema.org/' + orphanedProp,

                                function(err, result) {
                                    if (result) {
                                        intelligibleOrphanedProperty = true;
                                        callback();
                                    }

                                    else if (!result) {
                                        intelligibleOrphanedProperty = false;
                                        callback();
                                    }
                                    else if (err) {
                                       
                                        console.log(err);
                                    }
                                });
                            },

                            function(callback) {

                                getItempropertyValue($, $(orphanedNode),

                                function(error, result) {
                                    if (result) {
                                        itempropValue = result.trim();
                                        callback();
                                    }
                                    else if (error) {
                                        /* TODO: what should be done for this part? */
                                        console.log(error);
                                    }
                                });

                            },

                            function(callback) {
                            
                                var parentsWithAloneItemscope = $(orphanedNode).parents("[itemscope]");
                               
                                if (parentsWithAloneItemscope.length === 0) isOrphanedPropWithoutItemscope = true;
                                /** 3-4-1: If there is not any node with alone itemscope attr (without itemtype attr) above the current node as a parent. */
                                if (isOrphanedProp && !isOrphanedPropWithoutItemscope) {
                                    if (intelligibleOrphanedProperty) {
                                        /**
                                         * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>
                                         * <N0> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
                                         * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                                         * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop>
                                         * <N0> <ek> <value>
                                         */
                            
                                        subject = "<s" + blankNodeCounter_s + ">";
                                        blankNodeCounter_s++;
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                                            object: "<http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>",
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
                                            object: url,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: '',
                                            subject: "<e" + blankNodeCounter_e + ">",
                                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                                            object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: '',
                                            subject: "<e" + blankNodeCounter_e + ">",
                                            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                                            object: "http://schema.org/" + orphanedProp,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<e" + blankNodeCounter_e + ">",
                                            object: itempropValue,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                            
                                        blankNodeCounter_o++;
                                        blankNodeCounter_e++;
                            
                                    }
                            
                                    else if (!intelligibleOrphanedProperty) {
                                        /**
                                         * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>
                                         * <N0> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
                                         * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                                         * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                                         * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop>
                                         * <N0> <ek> <value>
                                         */
                            
                                        subject = "<s" + blankNodeCounter_s + ">";
                                        blankNodeCounter_s++;
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                                            object: "<http://www.redhat.com/2013/schema-parser#itemscopeWithoutItemtype>",
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
                                            object: url,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: '',
                                            subject: "<e" + blankNodeCounter_e + ">",
                                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                                            object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: '',
                                            subject: "<e" + blankNodeCounter_e + ">",
                                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                                            object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: '',
                                            subject: "<e" + blankNodeCounter_e + ">",
                                            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                                            object: "http://schema.org/" + orphanedProp,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<e" + blankNodeCounter_e + ">",
                                            object: itempropValue,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                            
                                        blankNodeCounter_o++;
                                        blankNodeCounter_e++;
                            
                                    }
                                }
                                else if (isOrphanedProp && isOrphanedPropWithoutItemscope) {
                            
                                    if (intelligibleOrphanedProperty) {
                                        /**
                                         * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                                         * <N0> <http://rdf.data-vocabulary.org/#url> <url>
                                         * <N0> <itemprop> <value>
                                         */
                            
                                        subject = "<s" + blankNodeCounter_s + ">";
                                        blankNodeCounter_s++;
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                                            object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<http://rdf.data-vocabulary.org/#url>",
                                            object: url,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: '',
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<http://schema.org/" + orphanedProp+">",
                                            object: itempropValue,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                            
                                        blankNodeCounter_o++;
                                    }
                                    else if (!intelligibleOrphanedProperty) {
                                        /**
                                         * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                                         * <N0> <http://rdf.data-vocabulary.org/#url> <url>
                                         * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                                         * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop> 
                                         * <N0> <ek> <value>
                                         */
                            
                                        subject = "<s" + blankNodeCounter_s + ">";
                                        blankNodeCounter_s++;
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                                            object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<http://rdf.data-vocabulary.org/#url>",
                                            object: url,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: '',
                                            subject: "<e" + blankNodeCounter_e + ">",
                                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                                            object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: '',
                                            subject: "<e" + blankNodeCounter_e + ">",
                                            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                                            object: "http://schema.org/" + orphanedProp,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                                        arrayItems = {
                                            subjectForFurtherUse: '',
                                            node: "",
                                            subject: "<N" + blankNodeCounter_o + ">",
                                            predicate: "<e" + blankNodeCounter_e + ">",
                                            object: itempropValue,
                                            objectForFurtherUse: ''
                                        };
                                        schemaArray.push(arrayItems);
                            
                            
                                        blankNodeCounter_o++;
                                        blankNodeCounter_e++;
                                    }
                            
                                }
                                itempropIndex++;
                                getOrphanedProperties($, itempropIndex);
                            }

                            ])

                        }
                        else {
                            itempropIndex++;
                            getOrphanedProperties($, itempropIndex);
                        }

                    }
                    else{
                        itempropIndex++;
                        getOrphanedProperties($, itempropIndex);
                    }

            }
            else {
                isTheLastItemprop = true;
                if (isTheLastItemtype && isTheLastItemprop) {
                    console.log(schemaArray);
                    writeInFile(_cb);
                }
            }
        }
        
        
        
/** 3- Get Properties: */
var atLeastOneAcceptableProperty = false,
     currentNodeItemtype = "",
     numberOfItempropInCurrentNode = ""; 
     
function getAllProperties($, currentNode, parentSubject, parentItemtypeIntelligibility, callback){      
//function getAllProperties(cb, $, currentNode, parentSubject, parentItemtypeIntelligibility) {
    
    atLeastOneAcceptableProperty = false,
    currentNodeItemtype = $(currentNode).attr("itemtype"),
    numberOfItempropInCurrentNode = currentNode.find("[itemprop]").length;
    
    /**
      To find properties of each node, we use "currentNode" and get all nodes with itemprop attribute 
      which are situated inside the "currentNode". as we should find the closest node with itemtype 
      attribute which matches our 'currentNode', we use "$(this).parent().closest("[itemtype*='http://schema.org']")".
     **/
     
    getCurrentNodeProperties(0);
    
    function getCurrentNodeProperties(currentNodeItempropIndex){
   
       
      if(currentNodeItempropIndex < numberOfItempropInCurrentNode) {

        var intelligibleProperty = false,
            validPropertyForType = false,
            itempropBesideItemtype = false,
            itempropValue = "",
            object = "",
            itempropNode = $(currentNode).find("[itemprop]")[currentNodeItempropIndex],
            currentProperty = $(itempropNode).attr("itemprop"),
            itempropParent = $(itempropNode).parent().closest("[itemtype*='http://schema.org']");
           
        if (itempropParent && itempropParent.is($(currentNode))) {
            
             

            if ($(itempropNode).attr("itemtype") && $(itempropNode).attr("itemtype").match("http://schema.org/")) itempropBesideItemtype = true;

             
            async.waterfall([

            function(cb) {
                
                /** Check the intelligibility of current property :*/
                validator.checkIsValidPropertyInSchema('http://schema.org/' + currentProperty,

                function(err, result) {
                    
                    if (result) {
                        intelligibleProperty = true;
                            cb();
                        }
                    else if (!result) {
                        intelligibleProperty = false;
                        cb();
                        }
                    else if (err) {
                        
                        console.log(err);
                    }
                });
                
            },

            function(cb) {
                /**
                              To check that the current itemprop is valid property for the itemtype of parent, we need to use "checkIsValidProperty" module.
                              As itemtype attribute of parent node is like "http://schema.org+ itemtype",
                              we should get the last part of this attribute:
                            */
                if (parentItemtypeIntelligibility && intelligibleProperty) {
                   
                    var itemtypeOfParent = $(itempropParent).attr("itemtype");
                    itemtypeOfParent = itemtypeOfParent.substring(itemtypeOfParent.lastIndexOf('/') + 1);

                    validator.checkIsValidProperty(itemtypeOfParent, currentProperty,

                    function(err, result) {
                        
                        if (result) {
                            validPropertyForType = true;
                            cb();
                        }
                        else if (!result) {
                            validPropertyForType = false;
                            cb();
                        }
                        else if (err) {
                            
                            console.log(err);

                        }
                    });
                }
                else {
                    
                    cb();
                }
            },

            function(cb) {
               
                /** 3-1: Alone property: */
                if (!itempropBesideItemtype) {
                   
                    async.waterfall([

                        function(cb_) {
                            getItempropertyValue($, $(itempropNode),
    
                            function(error, result) {
                                if (result) {
                                    itempropValue = result.trim();
                                    
                                    cb_();
                                }
                                else if (error) {
                                    
                                    console.log(error);
                                }
                            });
                        },
                        function(cb_) {
                           
                             if ((parentItemtypeIntelligibility && intelligibleProperty && validPropertyForType) || (!parentItemtypeIntelligibility && intelligibleProperty)) {
                                 /**
                                  * <bi> <itemprop> <value>
                                  */

                                 arrayItems = {
                                     subjectForFurtherUse: '',
                                     node: "",
                                     subject: parentSubject,
                                     predicate: "<http://schema.org/" + currentProperty + ">",
                                     object: itempropValue,
                                     objectForFurtherUse: ''
                                 };
                                 schemaArray.push(arrayItems);

                                 atLeastOneAcceptableProperty = true;

                    }
                             else if (parentItemtypeIntelligibility && intelligibleProperty && !validPropertyForType) {
            
                                    /**
                                     * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#notValidPropertyForType>
                                     * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop> 
                                     * <bi> <ek> <value>
                                     */
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: "<e" + blankNodeCounter_e + ">",
                                        predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ",
                                        object: "<http://www.redhat.com/2013/schema-parser#notValidPropertyForType>",
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: "<e" + blankNodeCounter_e + ">",
                                        predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                                        object: "http://schema.org/" + currentProperty,
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: parentSubject,
                                        predicate: "<e" + blankNodeCounter_e + ">",
                                        object: itempropValue,
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
            
                                    blankNodeCounter_e++;
            
                                }
                             else if (!intelligibleProperty) {
                                
                                    /**
                                     * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                                     * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop> 
                                     * <bi> <ek> <value>
                                     */
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: "<e" + blankNodeCounter_e + ">",
                                        predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ",
                                        object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: "<e" + blankNodeCounter_e + ">",
                                        predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                                        object: "http://schema.org/" + currentProperty,
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: parentSubject,
                                        predicate: "<e" + blankNodeCounter_e + ">",
                                        object: itempropValue,
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                
                                    blankNodeCounter_e++;
                                }   
                             if(cb_) cb();   
                    }
                    
                    
                    ])
                 
                }
                /** 3-2: Property and Type together: */
                else if (itempropBesideItemtype) {
                    
                    if ((parentItemtypeIntelligibility && intelligibleProperty && validPropertyForType) || (!parentItemtypeIntelligibility && intelligibleProperty)) {

                        /**
                         * <bi> <itemprop> <sj>
                         */

                        object = "<s" + blankNodeCounter_s + ">";
                        blankNodeCounter_s++;

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: $(itempropNode),
                            subject: parentSubject,
                            predicate: "<http://schema.org/" + currentProperty+">",
                            object: object,
                            objectForFurtherUse: object
                        };
                        schemaArray.push(arrayItems);

                        blankNodeCounter_e++;
                    }
                    else if (parentItemtypeIntelligibility && intelligibleProperty && !validPropertyForType) {

                        /**
                         * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#notValidPropertyForType>
                         * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop> 
                         * <bi> <ek> <sj>
                         */

                        object = "<s" + blankNodeCounter_s + ">";
                        blankNodeCounter_s++;

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ",
                            object: "<http://www.redhat.com/2013/schema-parser#notValidPropertyForType>",
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                            object: "http://schema.org/" + currentProperty,
                            objectForFurtherUse: ''
                        };

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: $(itempropNode),
                            subject: parentSubject,
                            predicate: "<e" + blankNodeCounter_e + ">",
                            object: object,
                            objectForFurtherUse: object
                        };
                        schemaArray.push(arrayItems);

                        blankNodeCounter_e++;
                    }
                    else if (!intelligibleProperty) {

                        /**
                         * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                         * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <itemprop> 
                         * <bi> <ek> <si>
                         */

                        object = "<s" + blankNodeCounter_s + ">";
                        blankNodeCounter_s++;

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ",
                            object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                            object: "http://schema.org/" + currentProperty,
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: $(itempropNode),
                            subject: parentSubject,
                            predicate: "<e" + blankNodeCounter_e + ">",
                            object: object,
                            objectForFurtherUse: object
                        };
                        schemaArray.push(arrayItems);

                        blankNodeCounter_e++;
                    }
                    cb();
                    
                }
            },
            
            function(cb) {
                
                 currentNodeItempropIndex++;
                 getCurrentNodeProperties(currentNodeItempropIndex);
            }
            
            ]);

        }
        else {
            currentNodeItempropIndex++;
            getCurrentNodeProperties(currentNodeItempropIndex);
        }
      }
      else if (currentNodeItempropIndex >= numberOfItempropInCurrentNode) {
           
            
            
            /** 3-3: Check if there is at least one property for the parent node with itemtype attr. */
            if (!atLeastOneAcceptableProperty) {
                /** 
                 * <bi> <http://www.redhat.com/2013/schema-parser#itemtypeWithoutAnyProperty> <itemtype>
                 */
                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: parentSubject,
                    predicate: "<http://www.redhat.com/2013/schema-parser#itemtypeWithoutAnyProperty>",
                    object: currentNodeItemtype,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);
            }
            
            callback();
           
        } 
         
    
}

  
   // });
}


function getItempropertyValue($, itempropNode, callback) {

    var result = "",
        error;
    /**
     * When there is a node with itemprop attribute,
     * triples will be :
     * <b0> <"http://schema.org/ itemprop"> <VALUE>
     * this value can be different based on the type of tag of the node:
     */

    if ($(itempropNode)[0].tagName === "TIME") {

        if ($(itempropNode).attr("datetime")) result = $(itempropNode).attr("datetime");
        else result = $(itempropNode).text();
    }
    else if ($(itempropNode)[0].tagName === "META") {

        if ($(itempropNode).attr("content")) result = $(itempropNode).attr("content");
        else result = $(itempropNode).text();

    }
    else if ($(itempropNode)[0].tagName === "LINK") {

        if ($(itempropNode).attr("href")) result = $(itempropNode).attr("href");
        else result = $(itempropNode).text();
    }
    else if ($(itempropNode)[0].tagName === "IMG") {

        if ($(itempropNode).attr("src")) {
            result = $(itempropNode).attr("src");
        }
        else result = $(itempropNode).text();
    }

    else result = $(itempropNode).text();


    if (callback) callback(error, result);
}


function writeInFile(cb) {

    if (schemaArray.length !== 0) {
        var _result = [];
        var fileName = "./rdf" + fileNameCounter + ".txt";
        fs.writeFile(fileName, "");

        for (var j = 0; j < schemaArray.length; j++) {

            var item1 = schemaArray[j].subject + "  " + schemaArray[j].predicate + "  " + schemaArray[j].object + "\n";
            fs.appendFileSync(fileName, item1 + "\n");
            _result.push({ subject: schemaArray[j].subject,
                            predicate: schemaArray[j].predicate,
                            object: schemaArray[j].object });
        }
        console.log("done!");
        cb(_result);
    }
    
          urlIndex++;
          getURLFromFile();
}
