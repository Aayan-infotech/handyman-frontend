pipeline {
    agent any

    environment {
        IMAGE_NAME = "amazingatul/ecom-web"
        CONTAINER_PORT = "2365"
        HOST_PORT = "2365"
        DOCKER_HUB_USERNAME = credentials('docker-hub-username') // Store in Jenkins Credentials
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password') // Store in Jenkins Credentials
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                script {
                    sh '''
                    npm install --legacy-peer-deps
                    npm test
                    '''
                }
            }
        }

        stage('Run ESLint') {
            steps {
                script {
                    sh 'npm run lint'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    sh 'echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin'
                }
            }
        }

        stage('Generate Next Image Tag') {
            steps {
                script {
                    def latestTag = sh(
                        script: '''
                        curl -s https://hub.docker.com/v2/repositories/amazingatul/ecom-web/tags/ | \
                        jq -r '.results[].name' | grep -E '^stage-v[0-9]+$' | sort -V | tail -n1 | awk -F'v' '{print $2}'
                        ''',
                        returnStdout: true
                    ).trim()

                    def newTag = latestTag ? "stage-v${latestTag.toInteger() + 1}" : "stage-v1"
                    env.NEW_STAGE_TAG = newTag
                    echo "New Docker Image Tag: ${newTag}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME} . 2>&1 | tee failure.log"
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                script {
                    sh """
                    docker tag ${IMAGE_NAME} ${IMAGE_NAME}:${env.NEW_STAGE_TAG}
                    docker tag ${IMAGE_NAME} ${IMAGE_NAME}:prodv1
                    """
                }
            }
        }

        stage('Security Scan with Trivy') {
            steps {
                script {
                    sh """
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                        aquasec/trivy image --exit-code 1 --severity HIGH,CRITICAL ${IMAGE_NAME}:${env.NEW_STAGE_TAG}
                    """
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    sh """
                    docker push ${IMAGE_NAME}:${env.NEW_STAGE_TAG}
                    docker push ${IMAGE_NAME}:prodv1
                    """
                }
            }
        }

        stage('Cleanup Old Docker Images') {
            steps {
                script {
                    sh """
                    OLD_IMAGES=\$(docker images ${IMAGE_NAME} --format "{{.Tag}}" | grep 'stage-v' | sort -V | head -n -4)
                    for tag in \$OLD_IMAGES; do
                        docker rmi ${IMAGE_NAME}:\$tag || true
                    done
                    """
                }
            }
        }

        stage('Stop Existing Container') {
            steps {
                script {
                    sh """
                    CONTAINER_ID=\$(docker ps -q --filter "publish=${HOST_PORT}")
                    if [ -n "\$CONTAINER_ID" ]; then
                        echo "Stopping existing container..."
                        docker stop "\$CONTAINER_ID" || true
                        docker rm "\$CONTAINER_ID" || true
                    else
                        echo "No container running on port ${HOST_PORT}"
                    fi
                    """
                }
            }
        }

        stage('Run New Docker Container') {
            steps {
                script {
                    sh "docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} ${IMAGE_NAME}:${env.NEW_STAGE_TAG}"
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline execution successful!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
