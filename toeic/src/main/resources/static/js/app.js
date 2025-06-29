// アプリケーション初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// アプリケーション初期化
function initializeApp() {
    setupEventListeners();
    checkAuthState();
}

// イベントリスナー設定
function setupEventListeners() {
    // 認証関連
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        showView('signup-view');
    });
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showView('login-view');
    });
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // グローバルなunauthorizedイベントをリッスン
    window.addEventListener('unauthorized', () => {
        console.warn('Unauthorized access detected. Logging out.');
        showUnauthenticatedViews();
        showView('login-view');
        showError('セッションが切れました。再度ログインしてください。');
    });
    
    // ナビゲーション
    document.getElementById('dashboard-btn').addEventListener('click', () => {
        showView('dashboard-view');
        loadDashboard();
        setActiveNavBtn('dashboard-btn');
    });
    document.getElementById('quiz-btn').addEventListener('click', () => {
        showView('quiz-view');
        setActiveNavBtn('quiz-btn');
    });
    document.getElementById('stats-btn').addEventListener('click', () => {
        showView('stats-view');
        statsView.loadStats();
        setActiveNavBtn('stats-btn');
    });
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // クイズ関連
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    // 次の問題ボタンと音声ボタンはHTMLのonclick属性で処理
    
    // 結果画面
    document.getElementById('restart-btn').addEventListener('click', () => {
        const questionCount = document.getElementById('question-count').value;
        quizView.startQuiz(parseInt(questionCount));
        showView('quiz-view');
    });
    document.getElementById('back-dashboard-btn').addEventListener('click', () => {
        showView('dashboard-view');
        loadDashboard();
        setActiveNavBtn('dashboard-btn');
    });
    
    // エラーメッセージ
    document.getElementById('error-close').addEventListener('click', hideError);
}

// 認証状態チェック
async function checkAuthState() {
    console.log('🔐 認証状態チェック開始');
    
    if (apiClient.isAuthenticated()) {
        console.log('✅ 認証済みユーザー');
        
        console.log('📡 ローディング表示');
        showLoading();
        
        console.log('🎯 認証済みビュー表示');
        showAuthenticatedViews();
        
        console.log('📱 ダッシュボードビュー表示');
        showView('dashboard-view');
        
        // ダッシュボードデータの読み込みは常に実行し、エラーでも続行
        console.log('📊 初期ダッシュボードデータ読み込み開始');
        await loadDashboard(); // エラーが発生してもthrowしないように修正済み
        console.log('✅ 初期ダッシュボードデータ読み込み完了');
        
        console.log('🔄 ローディング非表示');
        hideLoading();
        
        console.log('🎉 認証状態チェック完了');
    } else {
        console.log('❌ 未認証ユーザー');
        showUnauthenticatedViews();
        showView('login-view');
    }
}

// ログイン処理
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    console.log('🔐 ログイン開始:', email);
    
    try {
        console.log('📡 ローディング表示開始');
        showLoading();
        
        console.log('🌐 API呼び出し開始');
        const response = await apiClient.login(email, password);
        console.log('✅ API呼び出し成功:', response);
        
        // 認証成功後、画面遷移とダッシュボードデータ読み込みを順次実行
        showAuthenticatedViews();
        showView('dashboard-view');
        
        console.log('📊 ダッシュボードデータ読み込み開始');
        await loadDashboard(); // エラーが発生してもthrowしないように修正済み
        console.log('✅ ダッシュボードデータ読み込み完了');
        
        // フォームリセット
        document.getElementById('login-form').reset();
        
        console.log('🔄 ローディング非表示');
        hideLoading();
        console.log('🎉 ログイン完了');
    } catch (error) {
        console.error('❌ ログインエラー:', error);
        hideLoading();
        showError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
}

// サインアップ処理
async function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    console.log('👤 新規登録開始:', email);
    
    try {
        console.log('📡 ローディング表示開始');
        showLoading();
        
        console.log('🌐 API呼び出し開始');
        const response = await apiClient.signup(email, password);
        console.log('✅ API呼び出し成功:', response);
        
        // 認証成功後、画面遷移とダッシュボードデータ読み込みを順次実行
        showAuthenticatedViews();
        showView('dashboard-view');
        
        console.log('📊 ダッシュボードデータ読み込み開始');
        await loadDashboard(); // エラーが発生してもthrowしないように修正済み
        console.log('✅ ダッシュボードデータ読み込み完了');
        
        // フォームリセット
        document.getElementById('signup-form').reset();
        
        console.log('🔄 ローディング非表示');
        hideLoading();
        console.log('🎉 新規登録完了');
    } catch (error) {
        console.error('❌ 新規登録エラー:', error);
        hideLoading();
        showError('新規登録に失敗しました。別のメールアドレスをお試しください。');
    }
}

// ログアウト処理
function handleLogout() {
    apiClient.logout();
    showUnauthenticatedViews();
    showView('login-view');
}

// 認証済みビュー表示
function showAuthenticatedViews() {
    console.log('🔓 showAuthenticatedViews() 開始');
    
    const navbar = document.querySelector('.navbar');
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    
    console.log('📊 navbar要素:', navbar ? 'found' : 'not found');
    console.log('📊 login-view要素:', loginView ? 'found' : 'not found');
    console.log('📊 signup-view要素:', signupView ? 'found' : 'not found');
    
    if (navbar) {
        navbar.style.display = 'block';
        console.log('✅ navbar表示完了');
    }
    
    if (loginView) {
        loginView.style.display = 'none';
        console.log('✅ login-view非表示完了');
    }
    
    if (signupView) {
        signupView.style.display = 'none';
        console.log('✅ signup-view非表示完了');
    }
    
    console.log('🔓 showAuthenticatedViews() 完了');
}

// 未認証ビュー表示
function showUnauthenticatedViews() {
    document.querySelector('.navbar').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('result-view').style.display = 'none';
    document.getElementById('stats-view').style.display = 'none';
}

// ビュー表示
function showView(viewId) {
    console.log('📱 showView() 呼び出し:', viewId);
    
    // 全てのビューを非表示
    const views = document.querySelectorAll('.view');
    console.log('📋 見つかったビュー数:', views.length);
    
    views.forEach(view => {
        console.log('🔄 ビューを非表示:', view.id);
        view.classList.remove('active');
        view.style.display = 'none';
        view.style.opacity = '0';
    });
    
    // 指定されたビューを表示
    const targetView = document.getElementById(viewId);
    if (targetView) {
        console.log('✅ ターゲットビューを表示:', viewId);
        targetView.classList.add('active');
        targetView.style.display = 'block';
        
        setTimeout(() => {
            targetView.style.opacity = '1';
        }, 10);
        
        // 表示状態を確認
        const isVisible = targetView.classList.contains('active');
        console.log('🔍 ビューの表示状態:', isVisible);
        
        // CSSの計算スタイルも確認
        const computedStyle = window.getComputedStyle(targetView);
        console.log('🎨 計算されたdisplayスタイル:', computedStyle.display);
        
        // DOMの描画を強制
        targetView.offsetHeight;
        console.log('🔄 DOMリフロー実行完了');
    } else {
        console.error('❌ ターゲットビューが見つかりません:', viewId);
    }
}

// ナビゲーションボタンのアクティブ状態設定
function setActiveNavBtn(btnId) {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    document.getElementById(btnId).classList.add('active');
}

// ダッシュボード読み込み
async function loadDashboard() {
    console.log('📊 統計データ取得開始');
    
    // まずデフォルト値を設定
    document.getElementById('overall-accuracy').textContent = '-';
    document.getElementById('recent-accuracy').textContent = '-';
    document.getElementById('total-questions').textContent = '-';
    
    try {
        const stats = await apiClient.getStats();
        console.log('✅ 統計データ取得成功:', stats);
        
        // 統計情報表示
        document.getElementById('overall-accuracy').textContent = 
            stats.overallAccuracy ? `${Math.round(stats.overallAccuracy)}%` : '-';
        document.getElementById('recent-accuracy').textContent = 
            stats.recentAccuracy ? `${Math.round(stats.recentAccuracy)}%` : '-';
        document.getElementById('total-questions').textContent = 
            stats.totalQuestions || 0;
            
        console.log('✅ ダッシュボード表示更新完了');
    } catch (error) {
        console.error('❌ ダッシュボードデータ読み込み失敗:', error);
        console.log('⚠️ デフォルト値でダッシュボードを表示します');
        
        // エラーの場合はデフォルト値を表示（既に設定済み）
        // エラーを再スローせずに処理を続行
        console.log('✅ ダッシュボード表示（デフォルト値）完了');
    }
}

// クイズ開始
function startQuiz() {
    const questionCount = parseInt(document.getElementById('question-count').value);
    quizView.startQuiz(questionCount);
    showView('quiz-view');
    setActiveNavBtn('quiz-btn');
}

// ローディング表示
function showLoading() {
    console.log('🔄 showLoading() 呼び出し');
    const loadingElement = document.getElementById('loading');
    console.log('📦 loading要素:', loadingElement);
    loadingElement.classList.remove('hidden');
    console.log('✅ hiddenクラス削除完了');
}

// ローディング非表示
function hideLoading() {
    console.log('⏹️ hideLoading() 呼び出し');
    const loadingElement = document.getElementById('loading');
    console.log('📦 loading要素:', loadingElement);
    loadingElement.classList.add('hidden');
    console.log('✅ hiddenクラス追加完了');
}

// エラーメッセージ表示
function showError(message) {
    console.log('❌ showError() 呼び出し:', message);
    document.getElementById('error-text').textContent = message;
    document.getElementById('error-message').classList.remove('hidden');
    console.log('✅ エラーメッセージ表示完了');
}

// エラーメッセージ非表示
function hideError() {
    console.log('🔇 hideError() 呼び出し');
    document.getElementById('error-message').classList.add('hidden');
    console.log('✅ エラーメッセージ非表示完了');
}

// ユーティリティ関数
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
} 