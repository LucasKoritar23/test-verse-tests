pipeline {
    agent any

    environment {
        DB_USER = sh(returnStdout: true, script: 'echo $DB_USER').trim()
        DB_HOST = sh(returnStdout: true, script: 'echo $DB_HOST').trim()
        DB_DATABASE = sh(returnStdout: true, script: 'echo $DB_DATABASE').trim()
        DB_PASSWORD = sh(returnStdout: true, script: 'echo $DB_PASSWORD').trim()
        DB_PORT = sh(returnStdout: true, script: 'echo $DB_PORT').trim()
        URI_API = sh(returnStdout: true, script: 'echo $URI_API').trim()
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
                script {
                    def discordWebhookUrl = "$DISCORD_TEST_WEBHOOK_URL"
                    def jobName = "${JOB_NAME}"
                    def buildId = "${BUILD_ID}"
                    def buildUrl = "${BUILD_URL}"
                    def tagRunner = "${params.playwright_test_tag}"
                    def imageTest = "${params.image_test}"

                    sh """
                    curl -s -X POST -H 'Content-Type: application/json' -d '{
                        "username": "$jobName",
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
                                    "value": "$jobName"
                                },
                                {
                                    "name": "Image Test",
                                    "value": "$imageTest"
                                },
                                {
                                    "name": "Tag",
                                    "value": "$tagRunner"
                                },
                                {
                                    "name": "Build ID",
                                    "value": "$buildId"
                                },
                                {
                                    "name": "Pipeline URL",
                                    "value": "$buildUrl"
                                }
                            ]
                        }]
                    }' "$discordWebhookUrl"
                """
                }
            }
        }

        stage('CLEANING WORKDIR') {
            steps {
                deleteDir()
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
                sh 'pwd'
                sh "docker cp test-verse-tests-${params.image_test}:/test-verse-tests/allure-results /var/jenkins_home/workspace/pipeline-test-verse-running-tests/allure-results"
                sh "docker cp test-verse-tests-${params.image_test}:/test-verse-tests/reports /var/jenkins_home/workspace/pipeline-test-verse-running-tests/reports"
                sh "docker rm test-verse-tests-${params.image_test}"
            }
        }

        stage('Check Reports') {
            steps {
                sh 'ls'
                sh 'ls -la /var/jenkins_home/workspace/pipeline-test-verse-running-tests/allure-results'
                sh 'ls -la /var/jenkins_home/workspace/pipeline-test-verse-running-tests/reports'
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
                def discordWebhookUrl = "$DISCORD_TEST_WEBHOOK_URL"
                def jobName = "${JOB_NAME}"
                def buildId = "${BUILD_ID}"
                def buildUrl = "${BUILD_URL}"
                def tagRunner = "${params.playwright_test_tag}"
                def imageTest = "${params.image_test}"

                sh """
                    curl -s -X POST -H 'Content-Type: application/json' -d '{
                        "username": "$jobName",
                        "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Jenkins_logo.svg/1200px-Jenkins_logo.svg.png",
                        "embeds": [{
                            "title": "Build Report",
                            "description": "Build successful! :white_check_mark:",
                            "color": 65340,
                            "footer": {
                                "text": "test-verse API"
                            },
                            "fields": [
                                {
                                    "name": "Pipeline Name",
                                    "value": "$jobName"
                                },
                                {
                                    "name": "Image Test",
                                    "value": "$imageTest"
                                },
                                {
                                    "name": "Tag",
                                    "value": "$tagRunner"
                                },
                                {
                                    "name": "Build ID",
                                    "value": "$buildId"
                                },
                                {
                                    "name": "Pipeline URL",
                                    "value": "$buildUrl"
                                }
                            ]
                        }]
                    }' "$discordWebhookUrl"
                """
            }
        }

        failure {
            script {
                def discordWebhookUrl = "$DISCORD_TEST_WEBHOOK_URL"
                def jobName = "${JOB_NAME}"
                def buildId = "${BUILD_ID}"
                def buildUrl = "${BUILD_URL}"
                def tagRunner = "${params.playwright_test_tag}"
                def imageTest = "${params.image_test}"

                sh """
                    curl -s -X POST -H 'Content-Type: application/json' -d '{
                        "username": "$jobName",
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
                                    "value": "$jobName"
                                },
                                {
                                    "name": "Image Test",
                                    "value": "$imageTest"
                                },
                                {
                                    "name": "Tag",
                                    "value": "$tagRunner"
                                },
                                {
                                    "name": "Build ID",
                                    "value": "$buildId"
                                },
                                {
                                    "name": "Pipeline URL",
                                    "value": "$buildUrl"
                                }
                            ]
                        }]
                    }' "$discordWebhookUrl"
                """
            }
        }
    }
}
