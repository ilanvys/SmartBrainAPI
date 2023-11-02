const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', `Key ${process.env.CLARIFAI_API_KEY}`);

const handleModelCall = (modelId, imageUrl) => {
  return new Promise((resolve, reject) => {
    const USER_ID = process.env.USER_ID;
    const APP_ID = process.env.APP_ID;
    const IMAGE_URL = imageUrl;
    const MODEL_ID = modelId;
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
              reject(err);
          }
          if (response.status.code !== 10000) {
              reject(new Error('Post model outputs failed, status: ' + response.status.description));
          }
          resolve(response);
      }
    );
  })
}

const handleAPICalls = (req, res) => {
  const imageUrl = req.body.input;
  handleModelCall('face-detection', imageUrl)
  .then((faceModelResponse) => {
    return handleModelCall('general-image-recognition', imageUrl)
    .then(imageRecognitionResponse => {
      return { 
        faceModelResponse: faceModelResponse.outputs[0].data.regions, 
        imageRecognitionResponse: imageRecognitionResponse.outputs[0].data.concepts.map(obj => obj.name)
       };
    })
  })
  .then(response => res.json(response))
  .catch(err => res.status(500).json('Could not complete API calls'))
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err =>  res.status(400).json('Unable to get entries'))
}

module.exports = { 
  handleImage, 
  handleAPICalls 
};
