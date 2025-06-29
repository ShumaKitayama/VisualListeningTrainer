class ApiClient {
    constructor() {
        this.baseUrl = '/api';
        this.token = localStorage.getItem('authToken');
    }

    // 認証トークンの設定
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // 認証トークンの削除
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // HTTPリクエストのヘッダー作成
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // 汎用的なHTTPリクエスト
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                // エラーレスポンスの詳細を取得
                let errorDetails = '';
                try {
                    const errorBody = await response.text();
                    errorDetails = errorBody ? ` - ${errorBody}` : '';
                } catch (e) {
                    // エラーボディの取得に失敗した場合は無視
                }
                
                // 401/403エラーの場合は自動的にログアウト処理
                if (response.status === 401 || response.status === 403) {
                    this.handleUnauthorized();
                }
                
                const errorMessage = `HTTP error! status: ${response.status}${errorDetails}`;
                console.error('API request failed:', errorMessage, 'URL:', url);
                throw new Error(errorMessage);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error, 'URL:', url);
            throw error;
        }
    }

    // GET リクエスト
    async get(endpoint, params = {}) {
        let url = endpoint;
        
        // クエリパラメータがある場合は追加
        if (Object.keys(params).length > 0) {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => queryParams.append(key, params[key]));
            url += '?' + queryParams.toString();
        }
        
        return this.request(url, {
            method: 'GET'
        });
    }

    // POST リクエスト
    async post(endpoint, data = {}) {
        const response = await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    // 認証関連API
    async signup(email, password) {
        console.log('🔌 APIClient.signup() 呼び出し:', email);
        const response = await this.post('/auth/signup', { email, password });
        console.log('📥 signup レスポンス:', response);
        if (response.token) {
            console.log('🔑 トークン設定:', response.token.substring(0, 20) + '...');
            this.setToken(response.token);
        }
        return response;
    }

    async login(email, password) {
        console.log('🔌 APIClient.login() 呼び出し:', email);
        const response = await this.post('/auth/login', { email, password });
        console.log('📥 login レスポンス:', response);
        if (response.token) {
            console.log('🔑 トークン設定:', response.token.substring(0, 20) + '...');
            this.setToken(response.token);
        }
        return response;
    }

    logout() {
        this.clearToken();
        // ログアウト時にログイン画面にリダイレクト
        window.dispatchEvent(new CustomEvent('unauthorized'));
    }

    // 401/403エラー時の処理
    handleUnauthorized() {
        this.clearToken();
        window.dispatchEvent(new CustomEvent('unauthorized'));
    }

    // 問題関連API
    async getRandomQuestions(limit = 10) {
        return this.get('/questions/random', { limit });
    }

    // 回答関連API
    async submitAnswer(sessionId, questionId, choiceId) {
        return this.post('/results', {
            sessionId,
            questionId,
            choiceId
        });
    }

    async finishSession(sessionId) {
        return this.post(`/results/session/${sessionId}/finish`);
    }

    // 統計関連API
    async getStats() {
        return this.get('/stats/overview');
    }

    // 認証状態チェック
    isAuthenticated() {
        return !!this.token;
    }
}

// グローバルにインスタンスを作成
const apiClient = new ApiClient(); 