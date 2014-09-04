/*
DESCRIPTION: populate and store tokens in local storage
*/

//Save the token as the value parameter. The key is used to grab it later.
module.exports.saveToken(key, value) {
        // Check that there's some code there.
        if (!value) {
          console.log('Error: No value specified');
          return;
        }
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({key: value}, function() {
          // Notify that we saved.
          console.log('Settings saved.');
          console.log('Key: ' + key);
          console.log('Value: ' + value);
        });
      }

//Use the key to grab the back the value. Once it's grabbed it'll use the callback on the data.
module.exports.getToken(key, callback) {
        // Check that there's some code there.
    chrome.storage.sync.get(key, function (obj) {
    callback(obj);
});
}

