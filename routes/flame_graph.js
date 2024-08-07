const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
    try {
        // Request json body
        let team = req.body.team;
        let product = req.body.product;

        console.log("team", team);
        console.log("product", product);

        // Check if team and product are provided
        if (!team) {
            throw 'team is required';
        }
        if (!product) {
            throw 'product is required';
        }


        // Database
        const db = req.db;
        // Collection path
        let collection = 'teams/' + team + '/products/' + product + '/cpu_usage';

        // Get all the document references in the collection
        let snapshot = await db.collection(collection).listDocuments();

        // Prepare an object to hold all the data
        let data = {};

        // Iterate over each document in the collection
        for (let docRef of snapshot) {
            let docId = docRef.id;
            let docData = {};

            // Get all subcollections of the current document
            let collectionsSnapshot = await docRef.listCollections();

            for (let coll of collectionsSnapshot) {
                let collectionData = [];
                let docsSnapshot = await coll.get(); // Get all documents in the subcollection

                docsSnapshot.forEach(doc => {
                    collectionData.push({id: doc.id, ...doc.data()}); // Add document data to the collection array
                });

                docData[coll.id] = collectionData; // Store the subcollection data by collection name
            }

            data[docId] = docData; // Store all subcollections' data under the document ID
        }

        // Send the response
        res.status(200).send({data});

    } catch (error) {
        res.status(400).send({error: error});
    }
});

module.exports = router;