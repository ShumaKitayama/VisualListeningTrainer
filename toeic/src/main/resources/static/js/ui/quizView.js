class QuizView {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.sessionId = null;
        this.answers = [];
        this.startTime = null;
        this.timer = null;
        this.selectedChoiceId = null;
        this.hasAnswered = false;
        this.currentShuffledChoices = []; // シャッフルされた選択肢を保存
    }

    // クイズ開始
    async startQuiz(questionCount) {
        try {
            showLoading();
            
            const data = await apiClient.getRandomQuestions(questionCount);
            this.questions = data.questions;
            this.sessionId = data.sessionId;
            this.currentQuestionIndex = 0;
            this.answers = [];
            this.startTime = new Date();
            
            this.showQuestion();
            this.startTimer();
            
            hideLoading();
        } catch (error) {
            hideLoading();
            showError('問題の取得に失敗しました。');
        }
    }

    // 問題表示
    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.finishQuiz();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        
        // 回答状態をリセット
        this.hasAnswered = false;
        
        // 前回の結果表示をクリア
        this.clearResults();
        
        // 次の問題ボタンを非表示
        document.getElementById('next-question-btn').style.display = 'none';

        // 問題画像表示
        const imageElement = document.getElementById('question-image');
        imageElement.src = question.imagePath.startsWith('/') ? question.imagePath : `/${question.imagePath}`;
        imageElement.alt = `問題 ${this.currentQuestionIndex + 1}`;

        // 進捗更新
        this.updateProgress();

        // 選択肢をシャッフルして表示
        this.currentShuffledChoices = this.shuffleChoices(question.choices);
        this.displayChoiceButtons();
    }

    // 選択肢をシャッフル
    shuffleChoices(choices) {
        const shuffled = [...choices]
            .map(choice => ({ choice, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(obj => obj.choice);
        return shuffled;
    }

    // 選択肢ボタンを表示（A, B, C, Dのみ、英文は表示しない）
    displayChoiceButtons() {
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';

        this.currentShuffledChoices.forEach((choice, index) => {
            const choiceLabel = String.fromCharCode(65 + index); // A, B, C, D
            
            const choiceDiv = document.createElement('div');
            choiceDiv.className = 'choice-btn';
            choiceDiv.innerHTML = `
                <div class="choice-label">${choiceLabel}</div>
                <button class="choice-audio-btn" onclick="quizView.playChoice(${index})">🔊</button>
            `;
            
            // 選択肢をクリックした時の処理
            choiceDiv.addEventListener('click', (e) => {
                // 音声ボタンがクリックされた場合は選択処理をスキップ
                if (e.target.classList.contains('choice-audio-btn')) return;
                
                this.selectChoice(choice.id, choiceDiv, index);
            });
            
            choicesContainer.appendChild(choiceDiv);
        });
    }

    // 個別の選択肢音声再生
    playChoice(index) {
        if (index < 0 || index >= this.currentShuffledChoices.length) return;
        
        const choice = this.currentShuffledChoices[index];
        const choiceLabel = String.fromCharCode(65 + index);
        
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(`${choiceLabel}. ${choice.sentence}`);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        speechSynthesis.speak(utterance);
    }

    // 全選択肢を順番に再生
    speakAllChoices() {
        speechSynthesis.cancel();
        let currentIndex = 0;
        
        const speakNext = () => {
            if (currentIndex >= this.currentShuffledChoices.length) return;
            
            const choice = this.currentShuffledChoices[currentIndex];
            const choiceLabel = String.fromCharCode(65 + currentIndex);
            
            const utterance = new SpeechSynthesisUtterance(`${choiceLabel}. ${choice.sentence}`);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            utterance.onend = () => {
                currentIndex++;
                setTimeout(speakNext, 500); // 0.5秒の間隔を空けて次を再生
            };
            speechSynthesis.speak(utterance);
        };
        
        speakNext();
    }

    // 選択肢選択
    async selectChoice(choiceId, choiceElement, choiceIndex) {
        if (this.hasAnswered) return; // 既に回答済みの場合は処理しない

        try {
            this.hasAnswered = true;
            this.selectedChoiceId = choiceId;

            // 選択された選択肢をハイライト
            const choices = document.querySelectorAll('.choice-btn');
            choices.forEach(choice => choice.classList.remove('selected'));
            choiceElement.classList.add('selected');

            // 回答送信
            const question = this.questions[this.currentQuestionIndex];
            const result = await apiClient.submitAnswer(this.sessionId, question.id, choiceId);

            // 回答結果を保存
            this.answers.push({
                question,
                choiceId,
                isCorrect: result.isCorrect,
                selectedChoiceElement: choiceElement,
                selectedChoiceIndex: choiceIndex
            });

            // 即座にフィードバックを表示（回答送信レスポンスの正解情報を使用）
            this.showImmediateFeedback(result.isCorrect, choiceIndex, result.correctChoice);

            // 次の問題ボタンを表示
            document.getElementById('next-question-btn').style.display = 'inline-block';

        } catch (error) {
            this.hasAnswered = false;
            showError('回答の送信に失敗しました。');
        }
    }

    // 即座のフィードバック表示（解答後に初めて英文を表示）
    async showImmediateFeedback(isCorrect, selectedIndex, correctChoice) {
        const resultDiv = document.getElementById('quiz-result');
        const allChoicesDiv = document.getElementById('all-choices-text');
        
        if (!resultDiv) {
            // 結果表示用のDIVを作成
            const newResultDiv = document.createElement('div');
            newResultDiv.id = 'quiz-result';
            
            const newAllChoicesDiv = document.createElement('div');
            newAllChoicesDiv.id = 'all-choices-text';
            
            const questionContent = document.querySelector('.question-content');
            questionContent.appendChild(newResultDiv);
            questionContent.appendChild(newAllChoicesDiv);
        }

        // フィードバック表示
        const resultElement = document.getElementById('quiz-result');
        const allChoicesElement = document.getElementById('all-choices-text');

        // デバッグ用ログ
        console.log('Current shuffled choices:', this.currentShuffledChoices);
        console.log('Correct choice found:', correctChoice);
        
        // 正解の選択肢のインデックスを見つける
        const correctIndex = correctChoice ? this.currentShuffledChoices.findIndex(choice => choice.id === correctChoice.id) : -1;
        const correctLabel = correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : 'エラー';
        const selectedLabel = String.fromCharCode(65 + selectedIndex);

        // CSSクラスを削除してからリセット
        resultElement.className = '';
        resultElement.classList.add('quiz-result');

        if (isCorrect) {
            resultElement.classList.add('correct');
            resultElement.innerHTML = `✅ <strong>正解です！</strong><br>答え: ${selectedLabel}. ${this.currentShuffledChoices[selectedIndex].sentence}`;
        } else {
            resultElement.classList.add('incorrect');
            const correctChoiceText = correctChoice ? this.currentShuffledChoices.find(choice => choice.id === correctChoice.id)?.sentence || correctChoice.sentence : 'エラー: 正解が見つかりません';
            resultElement.innerHTML = `❌ <strong>不正解</strong><br>あなたの答え: ${selectedLabel}. ${this.currentShuffledChoices[selectedIndex].sentence}<br>正解: ${correctLabel}. ${correctChoiceText}`;
        }

        // 解答後に初めて全選択肢の英文を表示
        const choiceLabels = ['A', 'B', 'C', 'D'];
        allChoicesElement.innerHTML = '<strong>📝 選択肢（解答後表示）:</strong><br><br>' + 
            this.currentShuffledChoices.map((choice, idx) => {
                const label = choiceLabels[idx];
                const isCorrectChoice = correctChoice && choice.id === correctChoice.id;
                const isSelectedChoice = idx === selectedIndex;
                
                let style = '';
                if (isCorrectChoice) style = ' style="color: #28a745; font-weight: bold;"';
                else if (isSelectedChoice && !isCorrectChoice) style = ' style="color: #dc3545; font-weight: bold;"';
                
                return `<div style="margin: 8px 0; padding: 8px; background: ${isCorrectChoice || isSelectedChoice ? 'rgba(255,255,255,0.7)' : 'transparent'}; border-radius: 6px;">${label}. <span${style}>${choice.sentence}</span></div>`;
            }).join('');

        // 選択肢ボタンの正解・不正解表示
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choiceButtons.forEach((button, idx) => {
            button.classList.remove('selected');
            
            if (idx === correctIndex) {
                button.classList.add('correct');
            } else if (idx === selectedIndex && !isCorrect) {
                button.classList.add('incorrect');
            }
            
            // 選択を無効化
            button.classList.add('disabled');
            button.style.pointerEvents = 'none';
        });
    }

    // 結果表示をクリア
    clearResults() {
        const resultDiv = document.getElementById('quiz-result');
        const allChoicesDiv = document.getElementById('all-choices-text');
        
        if (resultDiv) resultDiv.innerHTML = '';
        if (allChoicesDiv) allChoicesDiv.innerHTML = '';
    }

    // 次の問題へ
    nextQuestion() {
        speechSynthesis.cancel(); // 音声再生を停止
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            this.finishQuiz();
        } else {
            this.showQuestion();
        }
    }

    // クイズ終了
    async finishQuiz() {
        try {
            clearInterval(this.timer);
            speechSynthesis.cancel();
            await apiClient.finishSession(this.sessionId);
            
            // 結果画面へ遷移
            const correctCount = this.answers.filter(answer => answer.isCorrect).length;
            const totalCount = this.answers.length;
            
            resultView.showResults({
                correctCount,
                totalCount,
                answers: this.answers,
                totalTime: this.getTotalTime()
            });
            
            showView('result-view');
        } catch (error) {
            showError('クイズの終了処理に失敗しました。');
        }
    }

    // タイマー開始
    startTimer() {
        this.timer = setInterval(() => {
            const elapsed = Math.floor((new Date() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // 経過時間取得
    getTotalTime() {
        return Math.floor((new Date() - this.startTime) / 1000);
    }

    // 進捗更新
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // 問題カウンター更新
        document.getElementById('question-counter').textContent = 
            `問題 ${this.currentQuestionIndex + 1} / ${this.questions.length}`;
    }
}

// グローバルインスタンス作成
const quizView = new QuizView(); 