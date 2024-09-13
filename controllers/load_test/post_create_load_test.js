let post_create_load_test = async (req, res) => {

    const dynamicScenarios = [
        {
            name: 'Get 3 animal pictures',
            flow: [
                {
                    loop: {
                        count: 100,
                        flow: [
                            { get: { url: '/dino' } },
                            { get: { url: '/pony' } },
                            { get: { url: '/armadillo' } },
                        ],
                    },
                },
            ],
        },
    ];

// Call the function with dynamic scenarios
    createYML(dynamicScenarios, req);

    res.status(200).send('Load test created successfully!');
    console.log('Load test created successfully!');
     const path = require('path');
    //Run code : artillery run --output report/report.json test/test.yml
    let ymlFilePath = path.join(__dirname, 'test', 'test.yml');
    let jsonFilePath = path.join(__dirname, 'report_json', 'report.json');
    const command = `artillery run --output ${jsonFilePath} ${ymlFilePath}`;
    try {
        await executeCommand(command);
    } catch (error) {
        console.error('Error executing command:', error);
    }

    //Run code: artillery report --output report_html/report.html report_json/report.json
    let htmlFilePath = path.join(__dirname, 'report_html', 'report.html');
    try {
        const command2 = `artillery report --output ${htmlFilePath} ${jsonFilePath}`;
        await executeCommand(command2);
    } catch (error) {
        console.error('Error executing command:', error);
    }


}







function createYML(scenarios, req) {
    const yaml = req.yaml;
    const fs = req.fs;

    const config = {
        "config": {
            "target": "https://www.google.com/",
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
            "ensure": {
                "thresholds": [
                    {
                        "http.response_time.p99": 100
                    },
                    {
                        "http.response_time.p95": 75
                    }
                ]
            }
        },
        "scenarios": [
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
    const filePath = path.join(__dirname, 'test', 'test.yml');

    // Create the directory if it doesn't exist
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Write the YAML to a file in 'test/test.yml'
    fs.writeFileSync(filePath, yamlStr, 'utf8');
    console.log('YML file created successfully in test/test.yml!');
}



function executeCommand(command) {
    return new Promise((resolve, reject) => {
        const exec = require('child_process').exec;
        console.log(`Executing command: ${command}`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}


module.exports = {post_create_load_test: post_create_load_test};
