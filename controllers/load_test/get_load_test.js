let get_load_test = async (req, res) => {
    const team = req.body.team;
    const product = req.body.product;
    const service = req.body.service;

    const db = req.db;

    const path = 'teams/' + team + '/products/' + product + '/load_test/' + service;

    //Get the document
    let docRef = db.doc(path);
    let doc = await docRef.get();

    if (!doc.exists) {
        return res.status(404).send({
            error: 'No data'
        });
    }


    res.status(200).send(doc.data());

}

module.exports = {get_load_test: get_load_test};
