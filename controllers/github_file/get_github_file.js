let get_github_file = async (req, res) => {

    try {

    const { Octokit } = await import("@octokit/rest");

    // Request json body
    let auth = req.body.auth;
    let owner = req.body.owner;
    let repo = req.body.repo;
    let path = req.body.path;

    console.log("auth", auth);
    console.log("owner", owner);
    console.log("repo", repo);
    console.log("path", path);

    if (!auth) {
        throw 'auth is required';
    }

    if (!owner) {
        throw 'owner is required';
    }

    if (!repo) {
        throw 'repo is required';
    }

    if (!path) {
        throw 'path is required';
    }



    const octokit = new Octokit({
        auth: auth,
    });

    const url = ``;
    console.log("url", url);

    // Get the file content
    await octokit.request(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        owner: 'OWNER',
        repo: 'REPO',
        path: 'PATH',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then(({data}) => {
        const encodedContent = data.content;
        // Decode the content
        const content = Buffer.from(encodedContent, 'base64').toString();
        // Log the content
        console.log(content);
        res.status(200).send({content: content});
    });

    }catch (error) {
        res.status(400).send({error: error});
    }


}




module.exports = { get_github_file };






