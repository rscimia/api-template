'use strict';
var  server = require('../server.js'),
      fs = require('fs'),
      dataFilePath = '../' + server.settings('dataFile'),
    // data default format
    dataTemplate = {
        bills: []
    },

    // initialize data object.
    data = {};

// Trying to load file
try {
  // require JSON file (it will parse it)
  // Will throw execption if it does not work
  data = require(dataFilePath);
}
catch(e) {
    // in that case, data equal {}.
  console.warn(e, 'Unable to load data from ', dataFilePath);
}

// merging loaded data to the template
function mergeData(data, template) {
  return Object.keys(template)     // get all dataTemplate keys.
    .reduce(function(mergedData, key) {     // for each dataTemplate key
        if (data[key]) {                       // if there is the same key in loaded data
            if (typeof template[key] === 'object' && !Array.isArray(template[key]))
              mergeData(data[key], template[key]);
            else
              mergedData[key] = data[key];        // add this data to mergedData
        }
        else                                  // else
            mergedData[key] = template[key];// take data from dataTemple

        return mergedData;                    // return mergedData
    }, {});
}

data = mergeData(data, dataTemplate);

// now data contain only keys that where in dataTemplate (every others have been ignored)
// data also have keys that where not in loaded data but are in dataTemplate to prevent data file
// to get unusable after evolution of model.

// using merged data to create tree
var model = new (require('baobab'))(data);

module.exports = model;
