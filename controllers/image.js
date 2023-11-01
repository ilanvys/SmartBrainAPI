const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', `Key ${process.env.CLARIFAI_API_KEY}`);

const handleAPICall = (req, res) => {
  const USER_ID = process.env.USER_ID;
  const APP_ID = process.env.APP_ID;
  const IMAGE_URL = req.body.input;
  const MODEL_ID = 'face-detection';
  stub.PostModelOutputs(
    {
        user_app_id: {
            'user_id': USER_ID,
            'app_id': APP_ID
        },
        model_id: MODEL_ID,
        inputs: [
            { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
        ]
    },
    metadata,
    (err, response) => {
        if (err) {
            throw new Error(err);
        }
        if (response.status.code !== 10000) {
            throw new Error('Post model outputs failed, status: ' + response.status.description);
        }
        res.json(response)
    }
  );
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries);
  })
  .catch(err =>  res.status(400).json('Unable to get entries'))
}

module.exports = { 
  handleImage, 
  handleAPICall 
};
