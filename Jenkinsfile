pipeline {
  agent {
    docker {
      image 'ci.mkdecision.com:5000/mk-aws-node:latest'
    }
  }
  environment {
    NPM_CONFIG_PREFIX = '/home/node/.npm-global'
    BUCKET = 'mk-merchants-test-cmc'
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
        withAWS(region: 'us-west-2', credentials: 'aws-jenkins-build', role: 'ContinuousIntegrationRole',
          roleAccount: '771203565851') {
          sh '''
            aws s3 sync --delete --exclude "*.*" ./public s3://$BUCKET/$GIT_BRANCH --content-type "text/html; charset=utf-8"
            aws s3 sync --delete --exclude "*" --include "*.css" --include "*.js" ./public s3://$BUCKET/$GIT_BRANCH
            aws s3 sync --delete --exclude "*" --include "*.*" --exclude "*.css" --exclude "*.js" ./public s3://$BUCKET/$GIT_BRANCH
          '''
        }
      }
    }
  }
}
