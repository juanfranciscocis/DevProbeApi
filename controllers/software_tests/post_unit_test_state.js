let post_unit_test_state = async (req, res) => {
    try {
        // Request json body
        let team = req.body.team;
        let product = req.body.product;
        let step = req.body.step;
        let unit_test_title = req.body.unit_test_title;
        let state = req.body.state;


        // Check if team, product, step, and state are provided
        if (!team) {
            throw 'team is required';
        }
        if (!product) {
            throw 'product is required';
        }
        if (!step) {
            throw 'step is required';
        }
        if (!unit_test_title) {
            throw 'unit_test_title is required';
        }
        if (state === undefined) {
            throw 'state is required';
        }

        // Database
        const db = req.db;

        // Collection path
        let collection = 'teams/' + team + '/products/' + product + '/software_testing/';

        // Get all the document "unit_tests" in the collection
        let snapshot = await db.collection(collection).doc("unit_tests").get();

        let data = snapshot.data();

        // Update the document with the new state
        for (let i = 0; i < data[step].length; i++) {
            if(data[step][i].title === unit_test_title) {
                data[step][i].state = state;

                //Update the last_state_changed field
                let date = new Date();
                // Format the date as DD/MM/YYYY HH:MM:SS
                str_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

                last_state_change_arr = data[step][i].last_state_change;

                last_state_change_arr.push({
                    date: str_date,
                    state: state
                });

                data[step][i].last_state_change = last_state_change_arr;


            }
        }


        //Update the document
        await db.collection(collection).doc("unit_tests").set(data);

        await db.collection(collection).doc("unit_tests").get().then(doc => {
            let document = doc.data();
            docuement=document[step];
            for(let i=0;i<docuement.length;i++){
                if(docuement[i].title===unit_test_title){
                    res.status(200).send(docuement[i]);
                }
            }
        });

    } catch (error) {
        res.status(400).send({error: error});
    }
}

module.exports = {post_unit_test_state: post_unit_test_state};
