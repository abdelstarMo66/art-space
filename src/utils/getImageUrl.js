const getImageUrl = (req, image) => req.protocol + '://' + req.get('host') + '/users/' + image;

module.exports = getImageUrl