class AdvancedQuestionMatcher {
    constructor() {
        this.knowledgeBase = {};
        this.similarityThreshold = 0.45;
        this.idfWeights = {};
        this.invertedIndex = {};
        this.algorithmWeights = {
            tfidf: 0.25,
            bm25: 0.25,
            jaroWinkler: 0.15,
            levenshtein: 0.10,
            sequence: 0.10,
            fuzzy: 0.10,
            keyword: 0.05
        };
    }

    async loadKnowledgeBase(jsonFile = 'knowledge_base.json') {
        try {
            const response = await fetch(jsonFile);
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }
            this.knowledgeBase = await response.json();

            this.idfWeights = this.computeIDF();

            this.invertedIndex = this.buildInvertedIndex();

            return true;
        } catch (error) {
            console.error('加载知识库失败:', error);
            this.knowledgeBase = {
                "": "请先重新加载知识库。"
            };

            this.idfWeights = this.computeIDF();

            this.invertedIndex = this.buildInvertedIndex();

            return false;
        }
    }

    tokenize(text) {
        text = text.replace(/[^\w\s]/g, '').toLowerCase().trim();

        const chars = text.split('').filter(c => c.trim());
        const tokens = [...chars];

        for (let i = 0; i < chars.length - 1; i++) {
            tokens.push(chars[i] + chars[i + 1]);
        }
        for (let i = 0; i < chars.length - 2; i++) {
            tokens.push(chars[i] + chars[i + 1] + chars[i + 2]);
        }

        return tokens;
    }

    computeIDF() {
        const docCount = Object.keys(this.knowledgeBase).length;
        if (docCount === 0) return {};

        const df = {};

        Object.keys(this.knowledgeBase).forEach(question => {
            const tokens = new Set(this.tokenize(question));
            tokens.forEach(token => {
                df[token] = (df[token] || 0) + 1;
            });
        });

        const idf = {};
        Object.keys(df).forEach(token => {
            idf[token] = Math.log((docCount + 1) / (df[token] + 1)) + 1;
        });

        return idf;
    }

    buildInvertedIndex() {
        const index = {};

        Object.keys(this.knowledgeBase).forEach(question => {
            const tokens = this.tokenize(question);
            tokens.forEach(token => {
                if (!index[token]) index[token] = new Set();
                index[token].add(question);
            });
        });

        return index;
    }

    getCandidateQuestions(userQuestion, topK = 20) {
        const tokens = this.tokenize(userQuestion);
        const candidates = {};

        tokens.forEach(token => {
            if (this.invertedIndex[token]) {
                this.invertedIndex[token].forEach(question => {
                    candidates[question] = (candidates[question] || 0) + 1;
                });
            }
        });

        if (Object.keys(candidates).length < 5) {
            return Object.keys(this.knowledgeBase);
        }

        return Object.entries(candidates)
            .sort((a, b) => b[1] - a[1])
            .slice(0, topK)
            .map(entry => entry[0]);
    }

    tfIdfSimilarity(text1, text2) {
        const tokens1 = this.tokenize(text1);
        const tokens2 = this.tokenize(text2);

        const tf1 = {};
        const tf2 = {};

        tokens1.forEach(token => { tf1[token] = (tf1[token] || 0) + 1; });
        tokens2.forEach(token => { tf2[token] = (tf2[token] || 0) + 1; });

        const vocabulary = new Set([...tokens1, ...tokens2]);

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        vocabulary.forEach(token => {
            const idf = this.idfWeights[token] || 1.0;
            const tfidf1 = (tf1[token] || 0) * idf;
            const tfidf2 = (tf2[token] || 0) * idf;

            dotProduct += tfidf1 * tfidf2;
            norm1 += tfidf1 ** 2;
            norm2 += tfidf2 ** 2;
        });

        if (norm1 === 0 || norm2 === 0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    bm25Score(query, document) {
        const k1 = 1.5;
        const b = 0.75;

        const queryTokens = this.tokenize(query);
        const docTokens = this.tokenize(document);

        const docLen = docTokens.length;
        const allDocs = Object.keys(this.knowledgeBase);
        const avgDocLen = allDocs.reduce((sum, q) => sum + this.tokenize(q).length, 0) / Math.max(allDocs.length, 1);

        const docTf = {};
        docTokens.forEach(token => { docTf[token] = (docTf[token] || 0) + 1; });

        let score = 0.0;
        const uniqueQueryTokens = [...new Set(queryTokens)];

        uniqueQueryTokens.forEach(token => {
            if (!docTf[token]) return;

            const tf = docTf[token];
            const idf = this.idfWeights[token] || 1.0;

            const numerator = tf * (k1 + 1);
            const denominator = tf + k1 * (1 - b + b * (docLen / avgDocLen));
            score += idf * (numerator / denominator);
        });

        return Math.min(score / (uniqueQueryTokens.length + 1), 1.0);
    }

    levenshteinSimilarity(s1, s2) {
        if (s1 === s2) return 1.0;

        if (s1.length > s2.length) {
            [s1, s2] = [s2, s1];
        }

        let distances = Array.from({ length: s1.length + 1 }, (_, i) => i);

        for (let j = 1; j <= s2.length; j++) {
            let newDistances = [j];
            for (let i = 1; i <= s1.length; i++) {
                if (s1[i - 1] === s2[j - 1]) {
                    newDistances.push(distances[i - 1]);
                } else {
                    newDistances.push(1 + Math.min(
                        distances[i - 1],
                        distances[i],
                        newDistances[newDistances.length - 1]
                    ));
                }
            }
            distances = newDistances;
        }

        const maxLen = Math.max(s1.length, s2.length);
        if (maxLen === 0) return 1.0;

        return 1.0 - (distances[distances.length - 1] / maxLen);
    }

    jaroWinklerSimilarity(s1, s2) {
        if (s1 === s2) return 1.0;

        const len1 = s1.length;
        const len2 = s2.length;

        if (len1 === 0 || len2 === 0) return 0.0;

        const matchDistance = Math.max(len1, len2) / 2 - 1;
        const matchDist = Math.max(0, Math.floor(matchDistance));

        const s1Matches = new Array(len1).fill(false);
        const s2Matches = new Array(len2).fill(false);

        let matches = 0;

        for (let i = 0; i < len1; i++) {
            const start = Math.max(0, i - matchDist);
            const end = Math.min(i + matchDist + 1, len2);

            for (let j = start; j < end; j++) {
                if (s2Matches[j] || s1[i] !== s2[j]) continue;

                s1Matches[i] = true;
                s2Matches[j] = true;
                matches++;
                break;
            }
        }

        if (matches === 0) return 0.0;

        let transpositions = 0;
        let k = 0;

        for (let i = 0; i < len1; i++) {
            if (!s1Matches[i]) continue;

            while (!s2Matches[k]) k++;

            if (s1[i] !== s2[k]) transpositions++;
            k++;
        }

        const jaro = (
            matches / len1 +
            matches / len2 +
            (matches - transpositions / 2) / matches
        ) / 3;

        let prefix = 0;
        for (let i = 0; i < Math.min(len1, len2, 4); i++) {
            if (s1[i] === s2[i]) {
                prefix++;
            } else {
                break;
            }
        }

        return jaro + prefix * 0.1 * (1 - jaro);
    }

    sequenceSimilarity(s1, s2) {
        if (s1 === s2) return 1.0;
        if (s1.length === 0 || s2.length === 0) return 0.0;

        let matches = 0;
        const maxLen = Math.max(s1.length, s2.length);

        for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
            if (s1[i] === s2[i]) matches++;
        }

        return matches / maxLen;
    }

    fuzzySubstringMatch(query, document) {
        const q = query.toLowerCase();
        const d = document.toLowerCase();

        if (q.includes(d) || d.includes(q)) return 1.0;

        const m = q.length;
        const n = d.length;

        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (q[i - 1] === d[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        const lcsLength = dp[m][n];
        return lcsLength / Math.max(m, n);
    }

    keywordOverlapScore(query, document) {
        const queryTokens = new Set(this.tokenize(query));
        const docTokens = new Set(this.tokenize(document));

        if (queryTokens.size === 0 || docTokens.size === 0) return 0.0;

        const intersection = new Set([...queryTokens].filter(x => docTokens.has(x)));
        const union = new Set([...queryTokens, ...docTokens]);

        const jaccard = intersection.size / union.size;

        const coverage = intersection.size / queryTokens.size;

        return 0.5 * jaccard + 0.5 * coverage;
    }

    ensembleSimilarity(query, document) {
        const tfidfSim = this.tfIdfSimilarity(query, document);
        const bm25Sim = this.bm25Score(query, document);
        const jwSim = this.jaroWinklerSimilarity(query, document);
        const levSim = this.levenshteinSimilarity(query, document);
        const seqSim = this.sequenceSimilarity(query, document);
        const fuzzySim = this.fuzzySubstringMatch(query, document);
        const keywordSim = this.keywordOverlapScore(query, document);

        const finalScore = (
            this.algorithmWeights.tfidf * tfidfSim +
            this.algorithmWeights.bm25 * bm25Sim +
            this.algorithmWeights.jaroWinkler * jwSim +
            this.algorithmWeights.levenshtein * levSim +
            this.algorithmWeights.sequence * seqSim +
            this.algorithmWeights.fuzzy * fuzzySim +
            this.algorithmWeights.keyword * keywordSim
        );

        return finalScore;
    }

    findBestMatch(userQuestion) {
        if (!userQuestion.trim()) {
            return { question: null, score: 0.0 };
        }

        if (userQuestion.includes('夏令营')) {
            return {
                question: '夏令营问题需联系管理员',
                score: 1.0,
                special: true,
                message: '此问题请询问作者或管理员。'
            };
        }

        const candidates = this.getCandidateQuestions(userQuestion);

        if (candidates.length === 0) {
            return { question: null, score: 0.0 };
        }

        let bestMatch = null;
        let bestScore = 0.0;

        candidates.forEach(question => {
            const score = this.ensembleSimilarity(userQuestion, question);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = question;
            }
        });

        return { question: bestMatch, score: bestScore };
    }

    answerQuestion(userQuestion) {
        const result = this.findBestMatch(userQuestion);

        if (result.special) {
            return {
                answer: result.message,
                confidence: 100,
                redirectedQuestion: result.question,
                matched: true
            };
        }

        if (result.question && result.score >= this.similarityThreshold) {
            const answer = this.knowledgeBase[result.question];
            const confidence = Math.round(result.score * 100);

            return {
                answer: answer,
                confidence: confidence,
                redirectedQuestion: result.question,
                matched: true
            };
        } else {
            return {
                answer: '此问题还没有答案，请联系作者或管理员。',
                confidence: Math.round(result.score * 100),
                redirectedQuestion: result.question || '无匹配',
                matched: false
            };
        }
    }
}

const matcher = new AdvancedQuestionMatcher();

document.addEventListener('DOMContentLoaded', async() => {
    function updateTime() {
        const now = new Date();
        document.getElementById('current-time').textContent =
            `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }

    setInterval(updateTime, 1000);
    updateTime();

    await matcher.loadKnowledgeBase();

    document.getElementById('send-btn').addEventListener('click', processQuestion);

    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processQuestion();
        }
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        document.getElementById('chat-messages').innerHTML = `
            <div class="message bot">
                <div class="message-header">
                    <span class="sender">系统</span>
                    <span class="time" id="current-time"></span>
                </div>
                <div class="message-content">
                    请输入您的问题，我将从知识库中查找最佳匹配的答案。
                </div>
            </div>
        `;
        updateTime();
    });

});

function processQuestion() {
    const userInput = document.getElementById('user-input');
    const question = userInput.value.trim();

    if (!question) return;

    addMessage('user', question, '用户');

    let specialHandled = false;

    if (question.includes('时候')) {
        const messageContent = '如果是关于日常作息的，请见下面这个链接的文档：<br><a href="https://docs.qq.com/sheet/DSEVCYkJhUXVGVVFs" target="_blank">https://docs.qq.com/sheet/DSEVCYkJhUXVGVVFs</a><br><br>如果您需要继续提问此问题，请点击"继续提问"按钮：<br><button class="continue-btn" onclick="continueQuestion(\'' + encodeURIComponent(question) + '\')">继续提问此问题</button>';
        addMessage('bot', messageContent, '系统');
        specialHandled = true;
    }

    if (question.includes('哪里') || question.includes('在哪')) {
        const messageContent = '如果是关于学校建筑位置的，请见下面这个链接的文档：<br><a href="https://docs.qq.com/pdf/DSHBieVVBS01RUUZU" target="_blank">https://docs.qq.com/pdf/DSHBieVVBS01RUUZU</a><br><br>如果您需要继续提问此问题，请点击"继续提问"按钮：<br><button class="continue-btn" onclick="continueQuestion(\'' + encodeURIComponent(question) + '\')">继续提问此问题</button>';
        addMessage('bot', messageContent, '系统');
        specialHandled = true;
    }

    if (!specialHandled) {
        const result = matcher.answerQuestion(question);

        let response = '';
        if (result.matched) {
            response = `
                <strong>重定向至：</strong>${result.redirectedQuestion}<br>
                <strong>解答：</strong>${result.answer}
            `;
        } else {
            response = result.answer;
        }

        addMessage('bot', response, '系统');
    }

    userInput.value = '';
    userInput.focus();

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function continueQuestion(encodedQuestion) {
    const question = decodeURIComponent(encodedQuestion);

    const result = matcher.answerQuestion(question);

    let response = '';
    if (result.matched) {
        response = `
            <strong>重定向至：</strong>${result.redirectedQuestion}<br>
            <strong>解答：</strong>${result.answer}
        `;
    } else {
        response = result.answer;
    }

    addMessage('bot', response, '系统');

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(sender, content, senderName) {
    const chatMessages = document.getElementById('chat-messages');
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="sender">${senderName}</span>
            <span class="time">${timeStr}</span>
        </div>
        <div class="message-content">${content}</div>
    `;

    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

let currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    setTheme(true);
} else if (currentTheme === 'light') {
    setTheme(false);
} else {
    setTheme(prefersDarkScheme.matches);
}

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setTheme(isDark);
});

prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches);
    }
});