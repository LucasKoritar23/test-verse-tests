def currentTag
def token
import groovy.json.JsonSlurper

pipeline {
    agent any

    environment {
        DB_USER = "$DB_USER"
        DB_HOST = "$DB_HOST"
        DB_DATABASE = "$DB_DATABASE"
        DB_PASSWORD = "$DB_PASSWORD"
        DB_PORT = "$DB_PORT"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/develop']],
                    userRemoteConfigs: [[
                        url: 'git@github.com:LucasKoritar23/test-verse-tests.git',
                        credentialsId: 'ssh-key-github'
                    ]]
                ])
            }
        }

        stage('Start Notify') {
            steps {
                sh '''
                        curl -s -X POST -H "Content-Type: application/json" -d '{
                            "username": "'${JOB_NAME}'",
                            "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/1200px-Jenkins_logo.svg.png",
                            "embeds": [{
                                "title": "Build Image Test Report",
                                "description": "Building Image Tests ⏳",
                                "color": 16776960,
                                "footer": {
                                    "text": "test-verse API"
                                },
                                "fields": [
                                    {
                                        "name": "Pipeline Name",
                                        "value": "'${JOB_NAME}'"
                                    },
                                    {
                                        "name": "Build ID",
                                        "value": "'${BUILD_ID}'"
                                    },
                                    {
                                        "name": "Pipeline URL",
                                        "value": "'${BUILD_URL}'"
                                    }
                                ]
                            }]
                        }' "$DISCORD_WEBHOOK_URL"
                    '''
            }
        }

        stage('Check Depencies for build') {
            steps {
                script {
                    sh 'docker -v'
                    sh 'docker-compose -v'
                    sh 'node -v'
                    sh 'npm -v'
                }
            }
        }

        stage('Check Files') {
            steps {
                script {
                    sh 'ls -la'
                }
            }
        }

        stage('GET Token Docker') {
            steps {
                script {
                    def curlCommand = "curl --location 'https://hub.docker.com/v2/users/login' \
                                        --header 'Content-Type: application/json' \
                                        --data-raw '{\"username\": \"${DOCKERHUB_USERNAME}\",\"password\": \"${DOCKERHUB_PASSWORD}\"}'"

                    def response = sh(script: curlCommand, returnStdout: true).trim()

                    def slurper = new JsonSlurper()
                    def jsonResponse = slurper.parseText(response)
                    token = jsonResponse.token
                }
            }
        }

        stage('GET Latest Tag') {
            steps {
                script {
                    def curlCommand = "curl --location 'https://hub.docker.com/v2/repositories/${DOCKERHUB_USERNAME}/test-verse/tags' \
                                       --header 'Authorization: Bearer ${token}' \
                                       --header 'Content-Type: application/json'"

                    def response = sh(script: curlCommand, returnStdout: true).trim()

                    def slurper = new JsonSlurper()
                    def jsonResponse = slurper.parseText(response)
                    currentTag = jsonResponse.results[0].name
                }
            }
        }

        stage('Build Docker Application') {
            steps {
                script {
                    sh "docker build -t $DOCKERHUB_USERNAME/test-verse-tests:${currentTag} ."
                    def message = "New Image Tests: ${currentTag} - API Test Verse"
                    sh "curl -X POST -H 'Content-Type: application/json' -d '{\"content\":\"${message}\"}' $DISCORD_WEBHOOK_URL"
                }
                }
            }
        }
    }

    post {
        success {
            script {
                sh '''
                    curl -s -X POST -H "Content-Type: application/json" -d '{
                    "username": "'${JOB_NAME}'",
                    "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/1200px-Jenkins_logo.svg.png",
                    "embeds": [{
                        "title": "Build Image Test Report",
                        "description": "Build Image tests created successful! :white_check_mark:",
                        "color": 65340,
                        "footer": {
                            "text": "test-verse API"
                        },
                        "fields": [
                            {
                                "name": "Pipeline Name",
                                "value": "'${JOB_NAME}'"
                            },
                            {
                                "name": "Build ID",
                                "value": "'${BUILD_ID}'"
                            },
                            {
                                "name": "Pipeline URL",
                                "value": "'${BUILD_URL}'"
                            }
                        ]
                    }]
                }' "$DISCORD_WEBHOOK_URL"
            '''
            }
        }

        failure {
            sh '''
                curl -s -X POST -H "Content-Type: application/json" -d '{
                    "username": "'${JOB_NAME}'",
                    "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/1200px-Jenkins_logo.svg.png",
                    "embeds": [{
                        "title": "Build Image Test Report",
                        "description": "Build Image tests created error! :frowning2:",
                        "color": 16711680,
                        "footer": {
                            "text": "test-verse API"
                        },
                        "fields": [
                            {
                                "name": "Pipeline Name",
                                "value": "'${JOB_NAME}'"
                            },
                            {
                                "name": "Build ID",
                                "value": "'${BUILD_ID}'"
                            },
                            {
                                "name": "Pipeline URL",
                                "value": "'${BUILD_URL}'"
                            }
                        ]
                    }]
                }' "$DISCORD_WEBHOOK_URL"
            '''
        }
    }
}
