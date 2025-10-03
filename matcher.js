/**
 * 高级问题匹配引擎 - JavaScript版本
 * 移植自Python版本的核心算法
 */

class AdvancedQuestionMatcher {
    constructor(knowledgeBase) {
        this.knowledgeBase = knowledgeBase;
        this.similarityThreshold = 0.30;
        this.idfWeights = this._computeIDF();
        this.invertedIndex = this._buildInvertedIndex();
    }

    /**
     * 中文分词 - 基于字符和n-gram的混合策略
     */
    tokenize(text) {
        // 移除标点符号（保留中文、英文、数字）
        text = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').toLowerCase().trim();
        
        // 提取字符
        const chars = text.split('').filter(c => c.trim());
        
        // 提取tokens（字符 + 2-gram + 3-gram）
        const tokens = [...chars];
        
        // 2-gram
        for (let i = 0; i < chars.length - 1; i++) {
            tokens.push(chars[i] + chars[i + 1]);
        }
        
        // 3-gram
        for (let i = 0; i < chars.length - 2; i++) {
            tokens.push(chars[i] + chars[i + 1] + chars[i + 2]);
        }
        
        return tokens;
    }

    /**
     * 计算IDF权重
     */
    _computeIDF() {
        const questions = Object.keys(this.knowledgeBase);
        const docCount = questions.length;
        
        if (docCount === 0) return {};
        
        // 统计文档频率
        const df = {};
        questions.forEach(question => {
            const tokens = new Set(this.tokenize(question));
            tokens.forEach(token => {
                df[token] = (df[token] || 0) + 1;
            });
        });
        
        // 计算IDF
        const idf = {};
        Object.keys(df).forEach(token => {
            idf[token] = Math.log((docCount + 1) / (df[token] + 1)) + 1;
        });
        
        return idf;
    }

    /**
     * 构建倒排索引
     */
    _buildInvertedIndex() {
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

    /**
     * 获取候选问题
     */
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
        
        // 如果候选太少，返回所有问题
        const candidateList = Object.entries(candidates)
            .sort((a, b) => b[1] - a[1])
            .map(([q]) => q);
        
        if (candidateList.length < 5) {
            return Object.keys(this.knowledgeBase);
        }
        
        return candidateList.slice(0, topK);
    }

    /**
     * TF-IDF余弦相似度
     */
    tfIdfSimilarity(text1, text2) {
        const tokens1 = this.tokenize(text1);
        const tokens2 = this.tokenize(text2);
        
        // 计算TF
        const tf1 = this._countTokens(tokens1);
        const tf2 = this._countTokens(tokens2);
        
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
        
        if (norm1 === 0 || norm2 === 0) return 0;
        
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    /**
     * BM25算法
     */
    bm25Score(query, document) {
        const k1 = 1.5;
        const b = 0.75;
        
        const queryTokens = this.tokenize(query);
        const docTokens = this.tokenize(document);
        
        const docLen = docTokens.length;
        const avgDocLen = Object.keys(this.knowledgeBase)
            .reduce((sum, q) => sum + this.tokenize(q).length, 0) / 
            Math.max(Object.keys(this.knowledgeBase).length, 1);
        
        const docTf = this._countTokens(docTokens);
        let score = 0;
        
        const uniqueQueryTokens = new Set(queryTokens);
        uniqueQueryTokens.forEach(token => {
            if (!docTf[token]) return;
            
            const tf = docTf[token];
            const idf = this.idfWeights[token] || 1.0;
            
            const numerator = tf * (k1 + 1);
            const denominator = tf + k1 * (1 - b + b * (docLen / avgDocLen));
            score += idf * (numerator / denominator);
        });
        
        return Math.min(score / (uniqueQueryTokens.size + 1), 1.0);
    }

    /**
     * Levenshtein编辑距离相似度
     */
    levenshteinSimilarity(s1, s2) {
        if (s1.length > s2.length) [s1, s2] = [s2, s1];
        
        let distances = Array.from({ length: s1.length + 1 }, (_, i) => i);
        
        for (let i2 = 0; i2 < s2.length; i2++) {
            const newDistances = [i2 + 1];
            for (let i1 = 0; i1 < s1.length; i1++) {
                if (s1[i1] === s2[i2]) {
                    newDistances.push(distances[i1]);
                } else {
                    newDistances.push(1 + Math.min(
                        distances[i1],
                        distances[i1 + 1],
                        newDistances[newDistances.length - 1]
                    ));
                }
            }
            distances = newDistances;
        }
        
        const maxLen = Math.max(s1.length, s2.length);
        return maxLen === 0 ? 1.0 : 1.0 - (distances[distances.length - 1] / maxLen);
    }

    /**
     * Jaro-Winkler相似度
     */
    jaroWinklerSimilarity(s1, s2) {
        if (s1 === s2) return 1.0;
        
        const len1 = s1.length;
        const len2 = s2.length;
        
        if (len1 === 0 || len2 === 0) return 0.0;
        
        const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
        
        const s1Matches = new Array(len1).fill(false);
        const s2Matches = new Array(len2).fill(false);
        
        let matches = 0;
        
        // 找到匹配字符
        for (let i = 0; i < len1; i++) {
            const start = Math.max(0, i - matchDistance);
            const end = Math.min(i + matchDistance + 1, len2);
            
            for (let j = start; j < end; j++) {
                if (s2Matches[j] || s1[i] !== s2[j]) continue;
                s1Matches[i] = true;
                s2Matches[j] = true;
                matches++;
                break;
            }
        }
        
        if (matches === 0) return 0.0;
        
        // 计算换位
        let transpositions = 0;
        let k = 0;
        for (let i = 0; i < len1; i++) {
            if (!s1Matches[i]) continue;
            while (!s2Matches[k]) k++;
            if (s1[i] !== s2[k]) transpositions++;
            k++;
        }
        
        const jaro = (matches / len1 + matches / len2 + 
                     (matches - transpositions / 2) / matches) / 3;
        
        // Winkler修正
        let prefix = 0;
        for (let i = 0; i < Math.min(len1, len2, 4); i++) {
            if (s1[i] === s2[i]) prefix++;
            else break;
        }
        
        return jaro + prefix * 0.1 * (1 - jaro);
    }

    /**
     * 序列匹配相似度
     */
    sequenceSimilarity(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        
        const m = s1.length;
        const n = s2.length;
        const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
        
        let maxLen = 0;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    maxLen = Math.max(maxLen, dp[i][j]);
                }
            }
        }
        
        return maxLen / Math.max(m, n);
    }

    /**
     * 模糊子串匹配
     */
    fuzzySubstringMatch(query, document) {
        query = query.toLowerCase();
        document = document.toLowerCase();
        
        if (query.includes(document) || document.includes(query)) {
            return 1.0;
        }
        
        // 最长公共子序列
        const m = query.length;
        const n = document.length;
        const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (query[i - 1] === document[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n] / Math.max(m, n);
    }

    /**
     * 关键词重叠得分
     */
    keywordOverlapScore(query, document) {
        const queryTokens = new Set(this.tokenize(query));
        const docTokens = new Set(this.tokenize(document));
        
        if (queryTokens.size === 0 || docTokens.size === 0) return 0;
        
        const intersection = new Set([...queryTokens].filter(x => docTokens.has(x)));
        const union = new Set([...queryTokens, ...docTokens]);
        
        const jaccard = intersection.size / union.size;
        const coverage = intersection.size / queryTokens.size;
        
        return 0.5 * jaccard + 0.5 * coverage;
    }

    /**
     * 集成相似度算法 - 核心匹配策略
     */
    ensembleSimilarity(query, document) {
        const tfidfSim = this.tfIdfSimilarity(query, document);
        const bm25Sim = this.bm25Score(query, document);
        const jwSim = this.jaroWinklerSimilarity(query, document);
        const levSim = this.levenshteinSimilarity(query, document);
        const seqSim = this.sequenceSimilarity(query, document);
        const fuzzySim = this.fuzzySubstringMatch(query, document);
        const keywordSim = this.keywordOverlapScore(query, document);
        
        return (
            0.25 * tfidfSim +
            0.25 * bm25Sim +
            0.15 * jwSim +
            0.10 * levSim +
            0.10 * seqSim +
            0.10 * fuzzySim +
            0.05 * keywordSim
        );
    }

    /**
     * 找到最佳匹配
     */
    findBestMatch(userQuestion) {
        if (!userQuestion.trim()) return { match: null, score: 0 };
        
        const candidates = this.getCandidateQuestions(userQuestion);
        
        if (candidates.length === 0) return { match: null, score: 0 };
        
        let bestMatch = null;
        let bestScore = 0;
        
        candidates.forEach(question => {
            const score = this.ensembleSimilarity(userQuestion, question);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = question;
            }
        });
        
        return { match: bestMatch, score: bestScore };
    }

    /**
     * 回答问题
     */
    answerQuestion(userQuestion) {
        if (!userQuestion.trim()) {
            return { success: false, message: '请输入有效的问题。' };
        }
        
        const { match, score } = this.findBestMatch(userQuestion);
        
        if (match && score >= this.similarityThreshold) {
            return {
                success: true,
                question: match,
                answer: this.knowledgeBase[match],
                confidence: Math.round(score * 100)
            };
        }
        
        return {
            success: false,
            message: '此问题还没有答案，请联系作者或管理员。'
        };
    }

    /**
     * 辅助方法：统计token频率
     */
    _countTokens(tokens) {
        const count = {};
        tokens.forEach(token => {
            count[token] = (count[token] || 0) + 1;
        });
        return count;
    }
}
