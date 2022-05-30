module.exports = theFunc => (rwq, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
}