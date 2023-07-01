pipeline {
    agent any

    environment {
        DB_USER = "$DB_USER"
        DB_HOST = "$DB_HOST"
        DB_DATABASE = "$DB_DATABASE"
        DB_PASSWORD = "$DB_PASSWORD"
        DB_PORT = "$DB_PORT"
        URI_API = "$URI_API"
    }

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
                    def envsApp = "export DB_USER=$DB_USER && export DB_HOST=$DB_HOST && export DB_DATABASE=$DB_DATABASE && export DB_PASSWORD=$DB_PASSWORD && export DB_PORT=$DB_PORT && export URI_API=$URI_API"
                    def dockerBuildCommand = "docker run --name=test-verse-tests-${params.image_test} -e DB_USER=$DB_USER -e DB_HOST=$DB_HOST -e DB_DATABASE=$DB_DATABASE -e DB_PASSWORD=$DB_PASSWORD -e DB_PORT=$DB_PORT -e URI_API=$URI_API -t $DOCKERHUB_USERNAME/test-verse-tests:${params.image_test}"
                    def playwrightCommand = "npm run test ${params.playwright_test_tag}"
                    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
                        sh "${envsApp} && ${dockerBuildCommand} ${playwrightCommand}"
                    }
                }
                sh "pwd"
                sh "docker cp test-verse-tests-${params.image_test}:/test-verse-tests/allure-results /var/jenkins_home/workspace/pipeline-test-verse-running-tests/allure-results"
                sh "ls"
            }
        }
    }

    post {
        always {
            allure([
                includeProperties: true,
                jdk: '',
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
        }
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
