const {response} = require("express");
let post_create_load_test = async (req, res) => {

    try {

        let target = req.body.target;
        let team = req.body.team;
        let product = req.body.product;
        let service = req.body.service;

        if (!target) {

            throw 'target is required';
        }


        if (!team) {
            throw 'team is required';
        }

        if (!product) {
            throw 'product is required';
        }

        if (!service) {
            throw 'service is required';
        }



        // Create the YAML file
        await createYML(target, req);
        res.status(200).send('Load test created successfully!');
        console.log('Load test created successfully!');


        // Run the load test
        const path = require('path');
        //Run code : artillery run --output report/report.json test/test.yml
        let report_len = await getReportLength(req);
        let yaml_len = report_len.yaml_len - 1;
        let json_len = report_len.json_len;
        let ymlFilePath = path.join(__dirname, 'test', `test_${yaml_len}.yml`);
        let jsonFilePath = path.join(__dirname, 'report_json', `report_${json_len}.json`);
        const command = `artillery run --output ${jsonFilePath} ${ymlFilePath}`;
        try {
            await executeCommand(command);
        } catch (error) {
            console.log("error", error);
            res.status(400).send(error);
        }
        console.log('Load test run successfully!');
        await setReportLength(req, {json_len: json_len + 1});
        await saveJSON(jsonFilePath, team, product, service, req);


        // Generate the HTML report
        //Run code: artillery report --output report_html/report.html report_json/report.json
        report_len = await getReportLength(req);
        let html_len = report_len.html_len;
        let htmlFilePath = path.join(__dirname, 'report_html', `report_${html_len}.html`);
        try {
            const command2 = `artillery report --output ${htmlFilePath} ${jsonFilePath}`;
            await executeCommand(command2);
        } catch (error) {
            console.log("error", error);
            res.status(400).send(error);
        }
        console.log('Load test report generated successfully!');
        await setReportLength(req, {html_len: html_len + 1});



    } catch (error) {
        console.log("error", error);
        res.status(400).send(error);
    }

}







async function createYML(target, req) {
    const yaml = req.yaml;
    const fs = req.fs;

    let file_len = await getReportLength(req);

    const config = {
        "config": {
            "target": target,
            "phases": [
                {
                    "duration": 1,
                    "arrivalRate": 1,
                    "rampTo": 5,
                    "name": "Warm up phase"
                },
                {
                    "duration": 1,
                    "arrivalRate": 5,
                    "rampTo": 10,
                    "name": "Ramp up load"
                },
                {
                    "duration": 1,
                    "arrivalRate": 10,
                    "rampTo": 30,
                    "name": "Spike phase"
                }
            ],
            "plugins": {
                "ensure": {},
                "apdex": {},
                "metrics-by-endpoint": {}
            },
            "apdex": {
                "threshold": 100
            },
        },
        "scenarios":[
            {
                "flow": [
                    {
                        "loop": [
                            {
                                "get": {
                                    "url": "/"
                                }
                            },
                        ],
                        "count": 100
                    }
                ]
            }
        ]
    }


    // Convert the JavaScript object to YAML format
    const yamlStr = yaml.stringify(config);

    const path = require('path');

    // Define the file path and ensure the directory exists
    const filePath = path.join(__dirname, 'test', `test_${file_len.yaml_len}.yml`);

    // Create the directory if it doesn't exist
    fs.mkdirSync(path.dirname(filePath), {recursive: true});

    // Write the YAML to a file in 'test/test.yml'
    fs.writeFileSync(filePath, yamlStr, 'utf8');

    // Update the report length
    await setReportLength(req, {yaml_len: file_len.yaml_len + 1});

}



function executeCommand(command) {
    return new Promise((resolve, reject) => {
        const exec = require('child_process').exec;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}


async function getReportLength(req) {
    const db = req.db;
    const path = 'api/load_test';

    let docRef = db.doc(path);
    let doc = await docRef.get();
    return doc.data();
}

async function setReportLength(req, new_length) {

    try {
        let data = await getReportLength(req);

        if (new_length.json_len) {
            data.json_len = new_length.json_len;
        }

        if (new_length.yaml_len) {
            data.yaml_len = new_length.yaml_len;
        }

        if (new_length.html_len) {
            data.html_len = new_length.html_len;
        }

        const db = req.db;
        const path = 'api/load_test';

        await db.doc(path).set(data, {merge: true});

        return true
    }catch (e) {
        console.log(e);
        return false;
    }
}

async function saveJSON(jsonFilePath, team, product, service, req) {
    //get json from file
    const fs = req.fs;
    const data = fs.readFileSync(jsonFilePath);
    const jsonData = JSON.parse(data);

    let date = new Date();
    //year, month, day, hour, minute, second
    const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

    //add date to jsonData
    jsonData.date = dateString;

    const db = req.db;
    const path = `teams/${team}/products/${product}/load_test/${service}`;
    //set data to database service = jsonData
    let len = await getReportLength(req)
    const report = `report_${len.json_len}`;
    let jsonString = JSON.stringify(jsonData);
    let dataToSave = {};
    dataToSave[report] = jsonString;
    await db.doc(path).set(dataToSave, {merge: true});
    console.log('JSON saved successfully!');
}




module.exports = {post_create_load_test: post_create_load_test};
