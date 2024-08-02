const express = require('express');
const router = express.Router();


router.post('/', async function (req, res, next) {
    try {

        let cpu_usage = req.body.cpu_usage; // Get the cpu_usage from the request body

        let devprobe_data = req.body.devprobe_data || ""// Get the devprobe_data from the request body

        let companyName = devprobe_data.companyName; // Get the companyName from the devprobe_data
        let productName = devprobe_data.productName; // Get the productName from the devprobe_data


        if (!cpu_usage) { // If cpu_usage is missing
            throw 'cpu_usage is required'; // Throw an error
        }

        //if no devprobe_data is provided
        console.log("devprobe_data", devprobe_data);
        if (!devprobe_data) { // If devprobe_data is missing
            throw 'devprobe_data is required, please provide companyName and productName'; // Throw an error
        }

        if (!companyName) { // If companyName is missing
            throw 'companyName is required'; // Throw an error
        }

        if (!productName) { // If productName is missing
            throw 'productName is required'; // Throw an error
        }


        //Database
        const db = req.db;
        //Collection path
        let collection = 'teams/' + companyName + '/products/';
        // Check if the collection exists
        let collectionRef = db.collection(collection);
        let snapshot = await collectionRef.limit(1).get();

        if (snapshot.empty) {
            return res.status(404).send({
                error: 'Collection does not exist'
            });
        }

        collection += productName +  '/cpu_usage';


        //Document = date
        let doc = new Date().toISOString().split('T')[0];

        let current_cpu_usage = [];
        let current_timestamp = [];

        //Get data from the database
        //Get the data
        let docRef = db.collection(collection).doc(doc);
        await docRef.get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                } else {
                    current_cpu_usage = doc.data().cpu_usage;
                    current_timestamp = doc.data().timestamp;
                    console.log('Document data:', doc.data().cpu_usage);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            })


        //Send data to the database firestore
        //Add cpu_usage to the current_cpu_usage
        current_cpu_usage.push(cpu_usage);
        //Add timestamp to the current_timestamp
        current_timestamp.push(new Date().toISOString().split('T')[1].split('.')[0]);

        db.collection(collection).doc(doc).set({
            cpu_usage: current_cpu_usage,
            timestamp: current_timestamp
        }).then(ref => {

            res.status(201).send({

                status: 'success',
                timestamp: new Date().toISOString(),
                devprobe_data: {
                    companyName: companyName,
                    productName: productName
                },
                data: {
                    cpu_usage: current_cpu_usage,
                    timestamp: current_timestamp
                }
            }); // Send the cpu_usage back as a response
        });


    } catch (e) {

        if (e === 'cpu_usage is required' || e === 'companyName is required' || e === 'productName is required' || e === 'devprobe_data is required') { // If the error message is 'cpu_usage is required'
            return res.status(400).send({error: e}); // Send a bad request status code and the error message
        }
        return res.status(500).send({
            error:
                'An error occurred while processing your request. Please try again later.'
        }); // Send an internal server error status code and a generic error message
    }


});

module.exports = router;