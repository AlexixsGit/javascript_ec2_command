const fs = require('fs');
const { command, instance, tag, message, keyExists, ensureKey } = require('./helpers');

/****************
AWS Configuration
*****************/
const AWS = require("aws-sdk")
AWS.config.region = "us-west-2"
AWS.config.apiVersions = {
  ec2: "2016-11-15"
}

/****************
Create an instance of EC2
*****************/
const ec2 = new AWS.EC2()


const keyParams = {
  KeyName: "ec2-js-sdk-key-pair"
}

/****************
Id of the instance given in the command line when run any command 
*****************/
const manageParams = {
  InstanceIds: [instance]
}

switch (command) {
  case 'key':
    keyExists(keyParams.KeyName, ()=>{
      ec2.createKeyPair(keyParams, (err, data)=>{
        if(err){
          console.error(err)
        }else{
          fs.writeFileSync('private.pem', data.KeyMaterial, 'utf-8');
          console.log('KeyPair created. Private key saved to `private.pem`.')
        }
      })
    })
    break;
  case 'create':
    /****************
    Create an instance with basic configuration: command line 'node ec2.js create'
    *****************/
    ensureKey(keyParams.KeyName, ()=>{
      let instanceParams = {
        ImageId: "ami-09dd2e08d601bff67",
        InstanceType: 't2.nano',
        KeyName: keyParams.KeyName,
        MinCount: 1,
        MaxCount: 1
      }
      ec2.runInstances(instanceParams, (err, data)=>{
        if(err){
          console.error(err)
        }else{
          const instanceId = data.Instances[0].InstanceId;
          console.log(`Instance Created. InstanceId: ${instanceId}`)
        }
      })
    })
    break;
    case 'tag':
    /****************
    Create a tag an assign it to the ec2 instance: command line 'node ec2.js tag <id> <name>'
    *****************/
      let tagParams ={
        Resources: [instance],
        Tags: [{Key: 'Name', Value: tag}]
      }
      ec2.createTags(tagParams, message)
      break;
    case 'start':
      /****************
      Start an instance:  command line 'node ec2.js start <id>'
      *****************/
      ec2.startInstances(manageParams, message)
      break;
    case 'stop':
       /****************
      stop an instance:  command line 'node ec2.js stop <id>'
      *****************/
      ec2.stopInstances(manageParams, message)    
      break;
    case 'reboot':
       /****************
      Reboot an instance:  command line 'node ec2.js reboot <id>'
      *****************/
      ec2.rebootInstances(manageParams, message)
      break;
    case 'terminate':
       /****************
      Termintate an instance:  command line 'node ec2.js terminate <id>'
      *****************/
      ec2.terminateInstances(manageParams, message)
    case 'describe':
      /****************
      Termintate an instance:  command line 'node ec2.js describe <id>'
      *****************/
      ec2.describeInstances(manageParams, message)
      break;
    case 'monitor':
      /****************
      Termintate an instance:  command line 'node ec2.js monitor <id>'
      *****************/
      ec2.monitorInstances(manageParams, message)
      break;
    case 'unmonitor':
      /****************
      Termintate an instance:  command line 'node ec2.js unmonitor <id>'
      *****************/
      ec2.unmonitorInstances(manageParams, message)
      break;
  default:
    console.error('Not a valid command!');
    break;
}
