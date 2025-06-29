class ResultView {
    constructor() {
        this.results = null;
    }

    // 結果表示
    showResults(results) {
        this.results = results;
        
        // スコア表示
        this.displayScore();
        
        // 詳細結果表示
        this.displayDetails();
    }

    // スコア表示
    displayScore() {
        const { correctCount, totalCount } = this.results;
        const percentage = Math.round((correctCount / totalCount) * 100);
        
        document.getElementById('score-percentage').textContent = `${percentage}%`;
        document.getElementById('correct-count').textContent = correctCount;
        document.getElementById('total-count').textContent = totalCount;
    }

    // 詳細結果表示
    displayDetails() {
        const detailsContainer = document.getElementById('result-details');
        detailsContainer.innerHTML = '';

        this.results.answers.forEach((answer, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
            
            const questionNumber = index + 1;
            const statusText = answer.isCorrect ? '正解' : '不正解';
            
            resultItem.innerHTML = `
                <img src="${answer.question.imagePath}" 
                     alt="問題${questionNumber}の画像" 
                     class="result-image"
                     loading="lazy">
                <div class="result-content">
                    <div class="result-status ${answer.isCorrect ? 'correct' : 'incorrect'}">
                        問題${questionNumber}: ${statusText}
                    </div>
                    <div class="result-choices">
                        ${this.renderChoices(answer)}
                    </div>
                    ${answer.question.explanation ? 
                        `<div class="result-explanation">
                            <strong>💡 解説:</strong> ${answer.question.explanation}
                        </div>` : ''}
                </div>
            `;
            
            detailsContainer.appendChild(resultItem);
        });
    }

    // 選択肢表示
    renderChoices(answer) {
        return answer.question.choices.map((choice, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = choice.id === answer.choiceId;
            const isCorrect = choice.is_correct === true;
            
            let className = '';
            let indicator = '';
            
            if (isSelected && isCorrect) {
                className = 'choice-correct-selected';
                indicator = ' ← あなたの回答 ✓ 正解';
            } else if (isSelected && !isCorrect) {
                className = 'choice-incorrect-selected';
                indicator = ' ← あなたの回答 ✗';
            } else if (isCorrect) {
                className = 'choice-correct';
                indicator = ' ← 正解';
            }
            
            return `
                <div class="choice-result ${className}">
                    <strong>${letter}.</strong> ${choice.sentence}
                    <span style="font-weight: 600;">${indicator}</span>
                </div>
            `;
        }).join('');
    }

    // 時間フォーマット
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}分${remainingSeconds}秒`;
    }
}

// グローバルインスタンス作成
const resultView = new ResultView(); 