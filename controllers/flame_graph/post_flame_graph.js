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
        let existingData = {};

        if (doc.exists && doc.data()) {
            existingData = doc.data();
            cpu_usage = existingData.cpu_usage || [];
        }

        // Function to recursively save and nest sub-services data correctly
        const saveSubServicesData = async (sub_services, existingDoc = {}) => {
            let updates = {};

            for (let sub_service of sub_services) {
                let sub_service_name = sub_service.name;

                // Get the existing sub-service data if available
                let existing_sub_service_data = existingDoc[sub_service_name] || {};

                let existing_cpu_usage_sub = existing_sub_service_data.cpu_usage || [];
                let existing_sub_services = existing_sub_service_data.sub_services || {};

                // Construct the nested structure for the current sub_service
                updates[sub_service_name] = {
                    "cpu_usage": [...existing_cpu_usage_sub, sub_service.cpu_usage],
                    "sub_services": existing_sub_services
                };

                // If there are more nested sub-services, recurse and nest them correctly
                if (sub_service.sub_services && sub_service.sub_services.length > 0) {
                    const nested_updates = await saveSubServicesData(sub_service.sub_services, existing_sub_services);
                    updates[sub_service_name].sub_services = {
                        ...updates[sub_service_name].sub_services,
                        ...nested_updates
                    };
                }
            }
            return updates;
        };

        // Save the top-level service data and nest sub-service data correctly
        let nested_sub_services_data = await saveSubServicesData(service.sub_services, existingData.sub_services || {});
        await db.doc(path).set({
            "cpu_usage": [...cpu_usage, service.cpu_usage],
            "sub_services": nested_sub_services_data
        }, { merge: true });

        // Respond with success
        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Failed to save data', error: error.message });
    }
};

module.exports = { post_flame_graph };