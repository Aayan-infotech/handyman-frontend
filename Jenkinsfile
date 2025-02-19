pipeline {
    agent any

    environment {
        IMAGE_NAME = "docker.io/aayanindia/handy-frontend"
        CONTAINER_PORT = "2365"
        HOST_PORT = "2365"
        DOCKER_HUB_USERNAME = credentials('docker-hub-username')
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password')
        EMAIL_RECIPIENTS = "atulrajput.work@gmail.com"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Run ESLint') {
            steps {
                script {
                    sh '''
                    #!/bin/bash
                    echo "Running ESLint..."
                    npm run lint || echo "⚠️ ESLint completed with errors, but continuing pipeline..."
                    '''
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    sh '''
                    #!/bin/bash
                    echo "Logging in to Docker Hub..."
                    if echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin; then
                        echo "✅ Docker Hub login successful!"
                    else
                        echo "❌ ERROR: Docker Hub login failed! Check credentials in Jenkins."
                        exit 1
                    fi
                    '''
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    sh '''
                    #!/bin/bash
                    echo "Building Docker image..."
                    docker build -t ${IMAGE_NAME}:latest .
                    echo "Pushing Docker images to Docker Hub..."
                    docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                emailext (
                    subject: "Pipeline Status: $(BUILD_NUMBER)",
                    body: '''<html>
                        <body>
                            <p>Build Status: $(BUILD_STATUS)</p>
                            <p>Build Number: $(BUILD_NUMBER)</p>
                            <p>Check the <a href="$(BUILD_URL)">console output</a>.</p>
                        </body>
                    </html>
                    ''',
                    to: 'atulrajput.work@gmail.com',
                    from: 'development.aayanindia@gmail.com',
                    replyTo: 'development.aayanindia@gmail.com',
                    mimeType: 'text/html'
                )
            }
        }
    }
}
