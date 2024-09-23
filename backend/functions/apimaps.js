const functions = require('firebase-functions');
const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

exports.getGeolocation = functions.https.onRequest((req, res) => {
  const address = req.query.address;

  client.geocode({
    params: {
      address: address,
      key: 'AIzaSyCL0EfCE_U5uo6kwZoUH8j3zW7AVlhefOE',
    },
  })
  .then((response) => {
    res.json(response.data);
  })
  .catch((error) => {
    res.status(500).send(error.response.data.error_message);
  });
});
