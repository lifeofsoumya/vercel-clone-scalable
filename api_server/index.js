const express = require('express')
const app = express();
const port = process.env.PORT || 9000;
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
require('dotenv').config();

app.use(express.json())

const wordToChoose = [
  'zero', 'yard', 'boat', 'free', 'fast', 'star', 'hurt',
  'get',  'AIDS', 'deal', 'jest', 'play', 'solo', 'cast',
  'real', 'glue', 'tape', 'set',  'man',  'lead', 'open',
  'fan',  'help', 'wind', 'wing', 'beer', 'bond', 'game',
  'fox',  'note', 'flat', 'seem', 'look', 'rub',  'date',
  'wall', 'arch', 'fire', 'room', 'line', 'rise', 'tank',
  'move', 'pack', 'row',  'bow',  'art',  'beg',  'view',
  'far',  'tin',  'care', 'draw', 'cute', 'gold', 'sign',
  'aunt', 'car',  'bus',  'fall', 'axis', 'baby', 'heel',
  'vote', 'band', 'slam', 'drum', 'bar',  'cell', 'club',
  'wash', 'suit', 'know', 'ride', 'dare', 'like', 'love',
  'owe',  'mind', 'run',  'beat', 'host', 'win',  'lack',
  'drop', 'bill', 'hold', 'wave', 'low',  'hot',  'late',
  'roar', 'left', 'bad',  'flex', 'turn', 'good', 'hook',
  'wine', 'bike' 
]

function generateRandomSlug(length = 3) {
  let slug = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * wordToChoose.length);
    slug += wordToChoose[randomIndex];
    if (i !== length - 1) {
      slug += '-';
    }
  }
  return slug;
}

const ecsClient = new ECSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
})

const ecsConfig = {
  cluster: 'arn:aws:ecs:ap-south-1:238116584495:cluster/builder-ocode',
  task: 'builder-task:1'
}

app.post('/project', async (req, res)=>{
  const { gitUrl } = req.body;
  const projectSlug = generateRandomSlug();
  
  const command = new RunTaskCommand({
    cluster: ecsConfig.cluster,
    taskDefinition: ecsConfig.task,
    launchType: 'FARGATE',
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: 'ENABLED',
        subnets: ['subnet-05112ae0da8029d93', 'subnet-021ff25227614e027', 'subnet-0476ce7300c715950'],
        securityGroups: ['sg-02f650af9948d23ee']
      }
    },
    overrides: {
      containerOverrides: [
        {
          name: 'builder-image',
          environment: [
            {
              name: 'GIT_REPOSITORY_URL', value: gitUrl
            },
            {
              name: 'PROJECT_ID', value: projectSlug
            }
          ]
        }
      ]
    }
  })
  
  await ecsClient.send(command);
  return res.json({ status: 'queued', data: { projectSlug }})

})

app.listen(port, ()=> console.log(`API server on ${port}`))