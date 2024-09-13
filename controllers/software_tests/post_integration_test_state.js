let post_integration_test_state = async (req, res) => {
    res.status(200).send({message: "ok"});


}

module.exports = {post_integration_test_state: post_integration_test_state};
