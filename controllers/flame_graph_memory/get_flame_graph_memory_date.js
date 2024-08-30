let get_flame_graph_date = async function (req, res, next) {
    try {
        // Request json body
        let team = req.body.team;
        let product = req.body.product;
        let date = req.body.date;

        console.log("team", team);
        console.log("product", product);
        console.log("date", date);

        // Check if team, product, and date are provided
        if (!team) {
            throw 'team is required';
        }
        if (!product) {
            throw 'product is required';
        }
        if (!date) {
            throw 'date is required';
        }

        // Database
        const db = req.db;
        // Collection path
        let collection = 'teams/' + team + '/products/' + product + '/memory_usage/';

        // Get all the document references in the date-specific collection
        let snapshot = await db.collection(collection).listDocuments();
        console.log("snapshot", snapshot);

        // Prepare an object to hold the filtered data
        let filteredData = {};

        // Iterate over each document in the collection
        for (let docRef of snapshot) {
            let docId = docRef.id;

            // Check if the document ID matches the requested date
            if (docId === date) {
                let docData = {};

                // Get all subcollections of the current document
                let collectionsSnapshot = await docRef.listCollections();

                for (let coll of collectionsSnapshot) {
                    let collectionData = [];
                    let docsSnapshot = await coll.get(); // Get all documents in the subcollection

                    docsSnapshot.forEach(doc => {
                        collectionData.push({ id: doc.id, ...doc.data() }); // Add document data to the collection array
                    });

                    docData[coll.id] = collectionData; // Store the subcollection data by collection name
                }

                filteredData[docId] = docData; // Store all subcollections' data under the document ID
                break; // Exit the loop early since we've found the matching date
            }
        }

        // Send the filtered response
        res.status(200).send(filteredData);

    } catch (error) {
        res.status(400).send({ error: error });
    }
}

module.exports = { get_flame_graph_date };