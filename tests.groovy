pipeline {
    agent any

    parameters {
        string(
            name: 'playwright_test_tag',
            defaultValue: '@testVerse',
            description: 'Set Tag Test'
        )
        string(
            name: 'image_test',
            defaultValue: 'latest',
            description: 'Set Image Test'
        )
    }

    stages {
        stage('Start Notify') {
            steps {
                sh '''
                        curl -s -X POST -H "Content-Type: application/json" -d '{
                            "username": "'${JOB_NAME}'",
                            "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/1200px-Jenkins_logo.svg.png",
                            "embeds": [{
                                "title": "Test Report",
                                "description": "Starting Tests ⏳",
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
                        }' "$DISCORD_TEST_WEBHOOK_URL"
                    '''
            }
        }

        stage('Running Tests') {
            steps {
                script {
                    sh "docker run -t $DOCKERHUB_USERNAME/test-verse-tests:${params.image_test} npm run test ${params.playwright_test_tag}"
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
                        "title": "Test Report",
                        "description": "Run Tests successful! :white_check_mark:",
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
                }' "$DISCORD_TEST_WEBHOOK_URL"
            '''
            }
        }

        failure {
            sh '''
                curl -s -X POST -H "Content-Type: application/json" -d '{
                    "username": "'${JOB_NAME}'",
                    "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/1200px-Jenkins_logo.svg.png",
                    "embeds": [{
                        "title": "Test Report",
                        "description": "Run Tests error! :frowning2:",
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
