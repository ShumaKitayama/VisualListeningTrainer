class StatsView {
    constructor() {
        this.stats = null;
    }

    // 統計データ取得・表示
    async loadStats() {
        try {
            showLoading();
            this.stats = await apiClient.getStats();
            this.displayStats();
            this.drawChart();
            hideLoading();
        } catch (error) {
            hideLoading();
            showError('統計データの取得に失敗しました。');
        }
    }

    // 統計データ表示
    displayStats() {
        if (!this.stats) return;

        // 日別統計表示
        this.displayDailyStats();
    }

    // 日別統計表示
    displayDailyStats() {
        const dailyStatsContainer = document.getElementById('daily-stats');
        dailyStatsContainer.innerHTML = '';

        if (this.stats.dailyStats && this.stats.dailyStats.length > 0) {
            this.stats.dailyStats.forEach(dailyStat => {
                const statItem = document.createElement('div');
                statItem.className = 'daily-stat-item';
                
                const date = new Date(dailyStat.date).toLocaleDateString('ja-JP');
                const accuracy = Math.round(dailyStat.accuracy * 10) / 10;
                
                statItem.innerHTML = `
                    <div>
                        <strong>${date}</strong><br>
                        <small>${dailyStat.questionsAnswered}問回答</small>
                    </div>
                    <div>
                        <strong>${accuracy}%</strong>
                    </div>
                `;
                
                dailyStatsContainer.appendChild(statItem);
            });
        } else {
            dailyStatsContainer.innerHTML = '<p>学習データがありません</p>';
        }
    }

    // チャート描画（簡易版）
    drawChart() {
        const canvas = document.getElementById('accuracy-chart');
        const ctx = canvas.getContext('2d');
        
        // キャンバスサイズを調整
        canvas.width = 300;
        canvas.height = 200;
        
        // キャンバスクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!this.stats || !this.stats.dailyStats || this.stats.dailyStats.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('データがありません', canvas.width / 2, canvas.height / 2);
            return;
        }

        // アニメーション付きで円グラフを描画
        this.animateAccuracyPieChart(ctx, canvas);
    }
    
    // アニメーション付き円グラフ描画
    animateAccuracyPieChart(ctx, canvas) {
        let animationProgress = 0;
        const animationDuration = 1000; // 1秒
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            animationProgress = Math.min(elapsed / animationDuration, 1);
            
            // イージング関数（easeOutCubic）
            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOutCubic(animationProgress);
            
            // キャンバスクリア
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 円グラフ描画
            this.drawAccuracyPieChart(ctx, canvas, easedProgress);
            
            if (animationProgress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    // 正答率の円グラフ描画
    drawAccuracyPieChart(ctx, canvas, progress = 1) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 70;
        const labelRadius = radius + 30; // ラベル表示用の半径
        
        const correctAnswers = this.stats.correctAnswers;
        const totalQuestions = this.stats.totalQuestions;
        const incorrectAnswers = totalQuestions - correctAnswers;
        
        if (totalQuestions === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('データがありません', centerX, centerY);
            return;
        }
        
        // 真上（-90度）から開始するための開始角度
        const startAngle = -Math.PI / 2;
        const correctAngle = (correctAnswers / totalQuestions) * 2 * Math.PI;
        
        // 影効果を追加
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // 正解部分（緑のグラデーション）
        const correctGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        correctGradient.addColorStop(0, '#81C784');
        correctGradient.addColorStop(1, '#4CAF50');
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + correctAngle * progress);
        ctx.closePath();
        ctx.fillStyle = correctGradient;
        ctx.fill();
        
        // 正解部分の境界線
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 不正解部分（赤のグラデーション）
        const incorrectGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        incorrectGradient.addColorStop(0, '#EF5350');
        incorrectGradient.addColorStop(1, '#F44336');
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        if (progress > 0.5) { // 不正解部分は遅れて表示
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle + correctAngle * progress, startAngle + 2 * Math.PI * progress);
            ctx.closePath();
            ctx.fillStyle = incorrectGradient;
            ctx.fill();
            
            // 不正解部分の境界線
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        // 中央に正答率表示
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        
        // 中央の白い円
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // パーセンテージ表示（アニメーション付き）
        ctx.fillStyle = '#333';
        const animatedAccuracy = Math.round(accuracy * progress);
        ctx.fillText(`${animatedAccuracy}%`, centerX, centerY);
        
        // ラベルを円グラフの外側に表示（アニメーション完了後）
        if (progress > 0.8) {
            this.drawExternalLabels(ctx, centerX, centerY, radius, labelRadius, correctAnswers, incorrectAnswers, startAngle, correctAngle, progress);
        }
    }
    
    // 外部ラベル描画
    drawExternalLabels(ctx, centerX, centerY, radius, labelRadius, correctAnswers, incorrectAnswers, startAngle, correctAngle, progress = 1) {
        ctx.shadowBlur = 0;
        ctx.font = '14px "Segoe UI", Arial, sans-serif';
        ctx.textBaseline = 'middle';
        
        // ラベルのフェードイン効果
        const labelOpacity = Math.max(0, (progress - 0.8) / 0.2);
        
        // 正解ラベル（正解部分の中央角度）
        const correctMidAngle = startAngle + (correctAngle / 2);
        const correctLabelX = centerX + Math.cos(correctMidAngle) * labelRadius;
        const correctLabelY = centerY + Math.sin(correctMidAngle) * labelRadius;
        
        // 正解ラベル線
        ctx.globalAlpha = labelOpacity;
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(correctMidAngle) * (radius + 5), centerY + Math.sin(correctMidAngle) * (radius + 5));
        ctx.lineTo(centerX + Math.cos(correctMidAngle) * (radius + 20), centerY + Math.sin(correctMidAngle) * (radius + 20));
        ctx.stroke();
        
        // 正解ラベルテキスト
        ctx.fillStyle = '#4CAF50';
        ctx.textAlign = correctLabelX > centerX ? 'left' : 'right';
        ctx.fillText(`正解: ${correctAnswers}問`, correctLabelX, correctLabelY);
        
        // 不正解ラベル（不正解部分の中央角度）
        const incorrectMidAngle = startAngle + correctAngle + ((2 * Math.PI - correctAngle) / 2);
        const incorrectLabelX = centerX + Math.cos(incorrectMidAngle) * labelRadius;
        const incorrectLabelY = centerY + Math.sin(incorrectMidAngle) * labelRadius;
        
        // 不正解ラベル線
        ctx.strokeStyle = '#F44336';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(incorrectMidAngle) * (radius + 5), centerY + Math.sin(incorrectMidAngle) * (radius + 5));
        ctx.lineTo(centerX + Math.cos(incorrectMidAngle) * (radius + 20), centerY + Math.sin(incorrectMidAngle) * (radius + 20));
        ctx.stroke();
        
        // 不正解ラベルテキスト
        ctx.fillStyle = '#F44336';
        ctx.textAlign = incorrectLabelX > centerX ? 'left' : 'right';
        ctx.fillText(`不正解: ${incorrectAnswers}問`, incorrectLabelX, incorrectLabelY);
        
        // globalAlphaをリセット
        ctx.globalAlpha = 1;
    }
}

// グローバルインスタンス作成
const statsView = new StatsView(); 