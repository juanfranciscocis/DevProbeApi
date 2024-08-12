let post_flame_graph = async function (req, res, next) {
    try {
        let db = req.db; // Get the database object FIRESTORE
        let data = req.body; // Extract the JSON data from the request body

        // Extract values from the JSON
        let { team, product, server, service } = data;

        // Construct the path for Firestore
        let date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        let basePath = `teams/${team}/products/${product}/cpu_usage/${date}`;
        let path = `${basePath}/${server}/${service.name}`;

        // Get the data from the database
        let docRef = db.doc(path);
        let doc = await docRef.get();

        // Get the current cpu_usage array from the service
        let cpu_usage = [];
        // If the document exists then get the cpu_usage array else set it to an empty array
        if (doc.exists && doc.data()) {
            doc = doc.data();
            cpu_usage = doc.cpu_usage;
        }

        for (let sub_service of service.sub_services) {
            let sub_service_name = sub_service.name;

            // Create a dictionary directly using the sub_service_name as the key and the cpu_usage as the value
            let sub_service_dict = {};
            let existing_cpu_usage_sub = [];

            // Check if sub_service_name key exists in the document and retrieve the cpu_usage if it does
            if (doc[sub_service_name] && doc[sub_service_name].cpu_usage) {
                existing_cpu_usage_sub = doc[sub_service_name].cpu_usage;
            }

            sub_service_dict[sub_service_name] = { "cpu_usage": [...existing_cpu_usage_sub, sub_service.cpu_usage] };

            // Update the document in Firestore
            await db.doc(path).set({
                "cpu_usage": [...cpu_usage, service.cpu_usage],
                ...sub_service_dict,
            }, { merge: true });
        }

        // Respond with success
        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Failed to save data', error: error.message });
    }
}

module.exports = { post_flame_graph };