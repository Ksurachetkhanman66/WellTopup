pipeline {
    agent any

    triggers {
        // เช็ค Git ทุก 2 นาที
        pollSCM('H/2 * * * *')
    }

    environment {
        BUILD_TAG = "${env.BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
    }

    parameters {
        booleanParam(name: 'CLEAN_VOLUMES', defaultValue: true, description: 'ล้างข้อมูล Database (Reset)')
        string(name: 'API_HOST', defaultValue: 'http://192.168.56.1:3001', description: 'API Host URL')
    }

    stages {
        // =========================================
        // 1. Checkout
        // =========================================
        stage('Checkout') {
            steps {
                script {
                    echo "📥 Pulling latest code..."
                    checkout scm
                }
            }
        }

        // =========================================
        // 2. Build (เตรียม Environment + Build Docker)
        // =========================================
        stage('Build') {
            steps {
                script {
                    echo "🔧 Preparing Environment..."
                    
                    // สร้างไฟล์ .env (แก้เป็นค่าของ Game Topup แล้ว)
                    withCredentials([
                        string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASS'),
                        string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASS')
                    ]) {
                        sh """
                            cat > .env <<EOF
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASS}
MYSQL_DATABASE=dit312_6601977
MYSQL_USER=topup_user
MYSQL_PASSWORD=${MYSQL_PASS}
MYSQL_PORT=3306
PHPMYADMIN_PORT=8888
API_PORT=3001
DB_PORT=3306
FRONTEND_PORT=3000
NODE_ENV=production
API_HOST=${params.API_HOST}
EOF
                        """
                    }
                    
                    echo "🐳 Building Docker Images..."
                    // ย้ายการ Build มาไว้ใน Stage นี้ตามที่คุณขอ
                    sh 'docker compose build'
                }
            }
        }

        // =========================================
        // 3. Deploy (รัน Container)
        // =========================================
        stage('Deploy') {
            steps {
                script {
                    echo "🚀 Deploying to Production..."

                    // ลบ Container เก่า
                    def downCmd = params.CLEAN_VOLUMES ? 'docker compose down -v' : 'docker compose down'
                    sh downCmd

                    // รัน Container ใหม่
                    sh 'docker compose up -d'
                }
            }
        }

        // =========================================
        // 4. Health Check (ตรวจสอบสถานะ)
        // =========================================
        stage('Health Check') {
            steps {
                script {
                    echo "🏥 Waiting for services to initialize..."
                    
                    // ✅ ใช้คำสั่งนี้แทน sleep:
                    // "รอสูงสุด 180 วินาที (3 นาที), เช็คทุกๆ 10 วินาที จนกว่าเว็บจะตอบ 200 OK"
                    sh """
                        timeout 180 bash -c 'until curl -s -f http://localhost:3001/api/games > /dev/null; do 
                            echo "⏳ Database is initializing... waiting 10s"
                            sleep 10
                        done'
                    """
                    
                    echo "🔍 Checking API Status..."
                    sh 'docker compose ps'
                    
                    echo "✅ Health Check Passed!"
                }
            }
        }
        
        // =========================================
        // 5. Verify (แถมให้ เพื่อดู Log)
        // =========================================
        stage('Verify Deployment') {
            steps {
                script {
                     echo "=== Deployed Services ==="
                     echo "Frontend: http://localhost:3000"
                     echo "API: http://localhost:3001"
                     echo "phpMyAdmin: http://localhost:8888"
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Completed Successfully!"
        }
        failure {
            echo "❌ Deployment Failed!"
            sh 'docker compose logs --tail=50'
        }
        always {
            // ล้างขยะ Docker ที่ไม่ใช้แล้ว
            sh 'docker image prune -f'
        }
    }
}