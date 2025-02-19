pipeline {
    agent any

    environment {
        IMAGE_NAME = "hand"
        CONTAINER_PORT = "2365"
        HOST_PORT = "2365"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Checkout source code from GitHub
                    checkout scm
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t ${IMAGE_NAME} .'
                }
            }
        }

        stage('Stop Existing Container') {
            steps {
                script {
                    sh '''
                    CONTAINER_ID=$(docker ps -q --filter "publish=${HOST_PORT}")
                    if [ -n "$CONTAINER_ID" ]; then
                        echo "Stopping existing container..."
                        docker stop "$CONTAINER_ID" || true
                        docker rm "$CONTAINER_ID" || true
                    else
                        echo "No container running on port ${HOST_PORT}"
                    fi
                    '''
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    sh 'docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} ${IMAGE_NAME}'
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
