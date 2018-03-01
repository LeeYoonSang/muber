const Driver = require('../models/driver');

module.exports = {
  greeting(req, res) {
    res.send({
      hi: 'there'
    });
  },

  create(req, res, next) {
    const driverProps = req.body;

    Driver.create(driverProps)
      .then(driver => res.send(driver))
      .catch(next); // 미들웨어를 호출함.
  },

  edit(req, res, next) {
    const driverId = req.params.id;
    const driverProps = req.body;

    Driver.findByIdAndUpdate({ _id: driverId }, driverProps)
      .then(() => Driver.findById({ _id: driverId }))
      .then(driver => res.send(driver))
      .catch(next);
  },

  delete(req, res, next) {
    const driverId = req.params.id;

    Driver.findByIdAndRemove({ _id: driverId })
      .then(driver => res.status(204).send(driver))
      .catch(next);
  },

  index(req, res, next) {
    // get 요청에는 req.body가 없다.
    // "http://foo.com?lng=80&lat=20" 형태의 query를 이용한다.
    const { lng, lat } = req.query;

    // Driver.geoNear(
    //   { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
    //   { spherical: true, maxDistance: 20000 }
    // );

    Driver.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          spherical: true,
          distanceField: 'dist',
          maxDistance: 200000
        }
      }
    ])
      .then(driver => res.send(driver))
      .catch(next);
  }
};
