module.exports = (req, res) => {
    console.log('v1/fragments working');
    res.status(200).json({
        status: 'ok',
        fragments: [],
    });
};