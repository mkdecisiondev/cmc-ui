pipeline {
  agent {
    docker {
      image 'ci.mkdecision.com:5000/mk-aws-node:latest'
      // Come back to this later:
      //args '-v axiom-ccos-node-modules:$WORKSPACE/node_modules -v axiom-ccos-global-modules:$HOME/.npm-global'
    }
  }
  environment {
    // Dont name them properly, or the cli will pick them up instead of the role.
    SPOOF_AWS_ACCESS_KEY_ID = credentials('jenkins-aws-access-key')
    SPOOF_AWS_SECRET_ACCESS_KEY = credentials('jenkins-aws-access-secret')
    NPM_CONFIG_PREFIX = '/home/node/.npm-global'
    BUCKET = 'mk-merchants-test-cmc'
    AWS_PROFILE='merchants-test'
  }
  stages {
    stage('Build') {
      steps {
        sh '''
          export PATH=/home/node/.npm-global/bin:$PATH
          yarn
          RELEASE=$GIT_BRANCH yarn build
        '''
      }
    }
    stage('Deploy') {
      steps {
        sh 'mkdir ~/.aws'
        configFileProvider([configFile(fileId:'aws-profiles', variable:'aws_profiles')]) {
          sh 'cp $aws_profiles ~/.aws/config'
          // It's messy, but AWS doesn't like spaces in their files.
          sh '''
            echo "
[default]
aws_access_key_id = $SPOOF_AWS_ACCESS_KEY_ID
aws_secret_access_key = $SPOOF_AWS_SECRET_ACCESS_KEY
            " >> ~/.aws/credentials
            aws s3 sync --delete --exclude "*.*" ./public s3://$BUCKET/$GIT_BRANCH --content-type "text/html; charset=utf-8"
            aws s3 sync --delete --exclude "*" --include "*.css" --include "*.js" ./public s3://$BUCKET/$GIT_BRANCH
            aws s3 sync --delete --exclude "*" --include "*.*" --exclude "*.css" --exclude "*.js" ./public s3://$BUCKET/$GIT_BRANCH
          '''
        }
      }
    }
  }
}
