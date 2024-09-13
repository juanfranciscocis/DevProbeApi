
let post_github_repo = async (req, res) => {

    try {
        const { Octokit } = await import("@octokit/rest");

        // Request json body
        let auth = req.body.auth;
        let owner = req.body.owner;
        let repo = req.body.repo;
        let branch = req.body.branch;

        console.log("auth", auth);
        console.log("owner", owner);
        console.log("repo", repo);

        if (!auth) {
            throw 'auth is required';
        }

        if (!owner) {
            throw 'owner is required';
        }

        if (!repo) {
            throw 'repo is required';
        }




        const octokit = new Octokit({
            auth: auth,
        });

        let url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
        console.log("url", url);

        // Get the file content
        await octokit.request(url, {
            owner: 'OWNER',
            repo: 'REPO',
            branch: 'BRANCH',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }).then(({data}) => {
            let tree = data.tree;
            let paths = [];
            for (let i = 0; i < tree.length; i++) {
                paths.push(tree[i].path);
            }

            res.status(200).send({paths: paths});
        });

    }catch (error) {
        console.log("error", error);
        res.status(400).send({error: error});
    }



}


module.exports = {get_github_repo: post_github_repo};
