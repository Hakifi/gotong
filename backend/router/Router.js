const router = require('express').Router();
require('dotenv').config({ path: './secret/.env' });

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.IDCLOUDHOST_ACCESS_KEY_ID,
        secretAccessKey: process.env.IDCLOUDHOST_SECRET_ACCESS_KEY,
    },
    endpoint: 'https://is3.cloudhost.id/',
    forcePathStyle: true,
    signatureVersion: 'v4',
});


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.IDCLOUDHOST_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, 'images/' + Date.now().toString() + '-' + file.originalname);
        },
        // check date
        metadata: function (req, file, cb) {
            console.log('metadata: ', file);
            cb(null, { fieldName: file.fieldname });
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

router.get('/test', (req, res) => {
    res.send('Hello World');
});

const Auth = require('../core/auth/Index');
const auth = new Auth();

router.post('/register', auth.register); //
router.post('/login', auth.login); //
router.post('/oAuth', auth.oAuth); //
router.get('/logout', auth.logout); //
router.get('/checkKey', auth.checkAuth, auth.getUserSimple);

// get activity
const Activity = require('../core/activity/Index');
const activity = new Activity();

router.get('/getActivityTypeSelect', activity.getActivityTypeSelect); //
router.get('/searchActivity', activity.searchActivity); //
router.get('/getNearestActivity', activity.getNearestActivity); //
router.get('/getActivity', activity.getActivity); //
router.post('/joinActivity', auth.checkAuth, activity.joinActivity);
router.get('/isUserInActivity', auth.checkAuth, activity.isUserInActivity);


router.get('/getContributions', auth.checkAuth, activity.getUserContributions);
router.post('/verifyContribution', auth.checkAuth, activity.verifyContribution);

router.get('/getTopRank', activity.getTopUser);

router.post('/postActivity', auth.checkAuth, upload.array('image'), activity.postActivity);


const User = require('../core/user/Index');
const user = new User();

router.get('/getUserProfileData', user.getUserProfileData);
router.get('/searchUser', user.searchUser);

// demo upload
router.post('/upload', upload.array('image'), (req, res) => {
    console.log(req.files);

    res.send('Upload success');
});


// web stuff
const Web = require('../core/web/Index');
const web = new Web();

router.get('/getBanner', web.getBanner);







module.exports = router;


