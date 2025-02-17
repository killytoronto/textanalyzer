/***********************************************************************
 * Utility Functions & Charts pls work
 ***********************************************************************/

// 1. Reading time chart 
function normalizeReadingTimeData(quickTime, mediumTime, thoroughTime) {
  const total = quickTime + mediumTime + thoroughTime;
  if (total === 0) return [0, 0, 0];
  return [
    Math.round((quickTime / total) * 100),
    Math.round((mediumTime / total) * 100),
    Math.round((thoroughTime / total) * 100)
  ];
}

// 2. Complexity chart 
function validateComplexityData(metrics) {
  return {
    vocabulary: Math.min(100, metrics.vocabularyScore),
    sentenceLength: Math.min(100, metrics.sentenceScore),
    structure: Math.min(100, metrics.structureScore),
    readability: Math.min(100, metrics.readabilityScore),
    technical: Math.min(100, metrics.technicalScore)
  };
}

// 3. Writing style evolution chart 
function processWritingStyleData(data, labels) {
  if (data.length < 2) {
    return {
      labels: ['Start', 'End'],
      data: [data[0] || 0, data[0] || 0]
    };
  }
  // smoothing 
  const smoothedData = data.map((value, index, array) => {
    if (index === 0 || index === array.length - 1) return value;
    return (array[index - 1] + value + array[index + 1]) / 3;
  });
  return { labels, data: smoothedData };
}

// 4. Lexical density chart 
function calculateLexicalDensityData(contentWords, functionWords) {
  const total = contentWords + functionWords;
  if (total === 0) return [50, 50]; // default if no words
  const contentPercentage = (contentWords / total) * 100;
  const functionPercentage = 100 - contentPercentage;
  return [
    parseFloat(contentPercentage.toFixed(1)),
    parseFloat(functionPercentage.toFixed(1))
  ];
}

// 5. Cohesion Chart 
function normalizeCohesionData(transitions, references, coherence) {
  // set a minimum max of 5 to avoid division by zero 
  const maxTransitions = Math.max(...transitions, 5);
  const maxReferences = Math.max(...references, 5);
  return {
    transitions: transitions.map(t => (t / maxTransitions) * 100),
    references: references.map(r => (r / maxReferences) * 100),
    coherence: coherence.map(c => Math.min(100, Math.max(0, c)))
  };
}

// 6. Data validation which should work better 
class ChartDataValidator {
  static validateNumericArray(data, min = 0, max = 100) {
    return data.map(value => {
      if (typeof value !== 'number' || isNaN(value)) return 0;
      return Math.min(max, Math.max(min, value));
    });
  }

  static ensureMinimumDataPoints(data, minPoints = 2) {
    if (data.length < minPoints) {
      return Array(minPoints).fill(data[0] || 0);
    }
    return data;
  }
}

// 7. Chart update queue
class ChartUpdateQueue {
  constructor() {
    this.updates = new Map();
    this.animationFrame = null;
  }

  queueUpdate(chartId, updateFn) {
    this.updates.set(chartId, updateFn);
    if (!this.animationFrame) {
      this.animationFrame = requestAnimationFrame(() => this.processUpdates());
    }
  }

  processUpdates() {
    this.updates.forEach((updateFn, chartId) => {
      updateFn();
    });
    this.updates.clear();
    this.animationFrame = null;
  }
}

// 8. Performance monitoring for charts updating 
class ChartPerformanceMonitor {
  static measureUpdateTime(chartId, updateFn) {
    const start = performance.now();
    updateFn();
    const duration = performance.now() - start;
    if (duration > 16.67) { // more than one frame (60fps)
      console.warn(`Chart update for ${chartId} took ${duration.toFixed(2)}ms`);
    }
  }
}

/***********************************************************************
 * Extended Regex and word list patterns
 ***********************************************************************/

// Transition patterns
const transitionPattern = /\b(?:however|moreover|furthermore|additionally|in addition|besides|similarly|subsequently|conversely|accordingly|alternatively|indeed|likewise)\b/gi;

// Evidence patterns
const evidencePattern = /\b(?:according to|cited by|reference|source|as stated in|as noted in|as reported by|per|based on|as mentioned in)\b/gi;

// Logical flow patterns
const logicalFlowPattern = /\b(?:therefore|thus|consequently|as a result|hence|accordingly|for this reason|in consequence|resultantly)\b/gi;

// Formal language patterns
const formalLanguagePattern = /\b(?:analyze|examine|investigate|evaluate|assess|scrutinize|appraise|explore|review|interpret)\b/gi;

// Counter-argument transitions
const counterArgumentsPattern = /\b(?:while|although|though|despite|nevertheless|even though|even if|notwithstanding|albeit|regardless|on the contrary)\b/gi;

// Emotional indicators patterns
const emotionalIndicatorsPattern = /\b(?:happy|delighted|excited|pleased|joyful|content|satisfied|cheerful|elated|optimistic|enthusiastic)\b/gi;

// Topic sentence (argumentative verbs) patterns
const topicSentencesPattern = /\b(?:argue|claim|propose|suggest|maintain|assert|contend|advocate|posit|declare|allege)\b/gi;

/***********************************************************************
 * More analyzers and utility functions
 ***********************************************************************/

// Enhanced topic sentence analyzer
class EnhancedTopicSentenceAnalyzer {
  static analyzeTopicSentences(paragraphs) {
    if (!Array.isArray(paragraphs) || !paragraphs.length) {
      return { score: 0, details: [], suggestions: [] };
    }
    const analysis = paragraphs.map((paragraph, index) => {
      const sentences = paragraph.split(/(?<=[.!?])\s+/);
      if (!sentences.length) return null;
      const topicSentence = sentences[0].trim();
      const restOfParagraph = sentences.slice(1).join(' ').trim();
      return {
        lengthScore: this.calculateLengthScore(topicSentence),
        hookStrength: this.evaluateHookStrength(topicSentence),
        relevanceScore: this.calculateRelevanceScore(topicSentence, restOfParagraph),
        clarityScore: this.analyzeClarityAndComplexity(topicSentence),
        transitionQuality: this.analyzeTransition(topicSentence, index > 0),
        mainIdeaPresence: this.evaluateMainIdea(topicSentence, restOfParagraph),
        coherenceScore: this.calculateCoherence(topicSentence, restOfParagraph),
        sentence: topicSentence,
        paragraphIndex: index
      };
    }).filter(Boolean);
    const overallScore = this.calculateOverallScore(analysis);
    const suggestions = this.generateSuggestions(analysis);
    return {
      score: overallScore,
      details: analysis,
      suggestions
    };
  }
  static calculateLengthScore(sentence) {
    const wordCount = sentence.split(/\s+/).length;
    if (wordCount >= 10 && wordCount <= 25) {
      return 100;
    } else if (wordCount < 10) {
      return (wordCount / 10) * 100;
    } else {
      return Math.max(0, 100 - ((wordCount - 25) * 4));
    }
  }
  static evaluateHookStrength(sentence) {
    const hooks = {
      question: /\?/.test(sentence) ? 25 : 0,
      statistics: /\d+(%|\s*percent|\s*times)?/.test(sentence) ? 20 : 0,
      quote: /"[^"]+"/.test(sentence) ? 20 : 0,
      pronouncement: /\b(important|significant|crucial|essential)\b/i.test(sentence) ? 15 : 0,
      contrast: /\b(however|although|unlike|contrary|whereas)\b/i.test(sentence) ? 20 : 0
    };
    return Object.values(hooks).reduce((sum, score) => sum + score, 0);
  }
  static calculateRelevanceScore(topicSentence, paragraph) {
    if (!paragraph) return 0;
    const topicWords = new Set(
      topicSentence.toLowerCase()
        .match(/\b\w{4,}\b/g)
        .filter(word => !this.getStopWords().has(word))
    );
    const paragraphWords = new Set(
      paragraph.toLowerCase()
        .match(/\b\w{4,}\b/g)
        .filter(word => !this.getStopWords().has(word))
    );
    const commonWords = [...topicWords].filter(word => paragraphWords.has(word));
    const relevanceRatio = commonWords.length / topicWords.size;
    return Math.min(100, relevanceRatio * 100);
  }
  static analyzeClarityAndComplexity(sentence) {
    const words = sentence.split(/\s+/);
    const complexityFactors = {
      longWords: words.filter(w => w.length > 12).length * 10,
      passiveVoice: /\b(?:am|is|are|was|were|be|been|being)\s+\w+ed\b/i.test(sentence) ? 15 : 0,
      nestedClauses: (sentence.match(/,/g) || []).length * 5,
      jargon: this.countJargonTerms(sentence) * 8
    };
    const totalPenalty = Object.values(complexityFactors).reduce((sum, val) => sum + val, 0);
    return Math.max(0, 100 - totalPenalty);
  }
  static analyzeTransition(sentence, isNotFirstParagraph) {
    if (!isNotFirstParagraph) return 100;
    const transitionPhrases = [
      'furthermore', 'moreover', 'in addition', 'similarly',
      'however', 'nevertheless', 'on the other hand',
      'consequently', 'therefore', 'thus', 'as a result'
    ];
    const hasTransition = transitionPhrases.some(phrase => 
      sentence.toLowerCase().includes(phrase)
    );
    return hasTransition ? 100 : 0;
  }
  static calculateOverallScore(analyses) {
    if (!analyses.length) return 0;
    const weights = {
      lengthScore: 0.2,
      hookStrength: 0.15,
      relevanceScore: 0.3,
      clarityScore: 0.25,
      transitionQuality: 0.1
    };
    return analyses.reduce((sum, analysis) => {
      const weightedScore = Object.entries(weights).reduce((score, [metric, weight]) => {
        return score + (analysis[metric] * weight);
      }, 0);
      return sum + weightedScore;
    }, 0) / analyses.length;
  }
  static getStopWords() {
    return new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do',
      'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say',
      'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would',
      'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about'
    ]);
  }
  static countJargonTerms(sentence) {
    const jargonTerms = [
      'leverage', 'synergy', 'paradigm', 'optimization',
      'methodology', 'implementation', 'framework', 'infrastructure'
    ];
    return jargonTerms.filter(term => 
      sentence.toLowerCase().includes(term)
    ).length;
  }
  static evaluateMainIdea(topicSentence, paragraph) {
    const topicWords = new Set(topicSentence.toLowerCase().split(/\s+/));
    const paragraphWords = new Set(paragraph.toLowerCase().split(/\s+/));
    const commonWords = [...topicWords].filter(word => paragraphWords.has(word));
    return commonWords.length > 0 ? 100 : 0;
  }
  static calculateCoherence(topicSentence, paragraph) {
    return this.calculateRelevanceScore(topicSentence, paragraph);
  }
  static generateSuggestions(analyses) {
    const suggestions = [];
    const avgStrength = analyses.reduce((sum, a) => sum + a.hookStrength, 0) / analyses.length;
    if (avgStrength < 50) {
      suggestions.push("Consider using stronger hooks in your topic sentences.");
    }
    return suggestions;
  }
}

// Enhanced opening variety 
class EnhancedOpeningVarietyAnalyzer {
  static analyzeOpeningVariety(sentences) {
    if (!sentences.length) {
      return { score: 0, details: {}, suggestions: [] };
    }
    const openings = sentences.map(sentence => {
      const words = sentence.trim().split(/\s+/);
      const firstThreeWords = words.slice(0, 3);
      return {
        firstWord: words[0].toLowerCase(),
        firstPhrase: firstThreeWords.join(' ').toLowerCase(),
        type: this.categorizeOpening(firstThreeWords),
        complexity: this.analyzeOpeningComplexity(firstThreeWords),
        strength: this.evaluateOpeningStrength(firstThreeWords, sentence)
      };
    });
    const analysis = {
      uniqueWordVariety: this.calculateUniqueWordVariety(openings),
      phraseVariety: this.calculatePhraseVariety(openings),
      typeDistribution: this.analyzeTypeDistribution(openings),
      patternQuality: this.evaluatePatterns(openings),
      transitionStrength: this.analyzeTransitions(openings)
    };
    return {
      score: this.calculateOverallScore(analysis),
      details: analysis,
      suggestions: this.generateSuggestions(analysis, openings)
    };
  }
  static categorizeOpening(words) {
    const patterns = {
      subject: /^(?:the|a|an|this|that|these|those|my|your|his|her|its|our|their)\b/i,
      action: /^(?:\w+ed|\w+ing)\b/i,
      question: /^(?:who|what|when|where|why|how)\b/i,
      transition: /^(?:however|moreover|furthermore|additionally|therefore)\b/i,
      description: /^(?:\w+ly)\b/i,
      prepositional: /^(?:in|on|at|by|with|under|over)\b/i,
      conjunction: /^(?:and|but|or|nor|yet|so|if|then|while|because)\b/i
    };
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(words[0])) return type;
    }
    return 'other';
  }
  static analyzeOpeningComplexity(words) {
    const factors = {
      wordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
      phraseLength: words.length,
      containsModifier: words.some(w => w.endsWith('ly')),
      containsPreposition: /^(?:in|on|at|by|with|under|over)\b/i.test(words[0])
    };
    let complexity = 50;
    complexity += factors.wordLength > 6 ? 20 : 0;
    complexity += factors.phraseLength > 2 ? 15 : 0;
    complexity += factors.containsModifier ? 10 : 0;
    complexity += factors.containsPreposition ? 5 : 0;
    return Math.min(100, complexity);
  }
  static evaluateOpeningStrength(words, fullSentence) {
    const criteria = {
      clarity: !words.some(w => w.length > 12),
      impact: words.some(w => this.getImpactWords().has(w.toLowerCase())),
      connection: this.evaluateConnectionToMain(words, fullSentence)
    };
    return Object.values(criteria).filter(Boolean).length * 33.33;
  }
  static calculateUniqueWordVariety(openings) {
    const uniqueWords = new Set(openings.map(o => o.firstWord));
    return (uniqueWords.size / openings.length) * 100;
  }
  static calculatePhraseVariety(openings) {
    const uniquePhrases = new Set(openings.map(o => o.firstPhrase));
    return (uniquePhrases.size / openings.length) * 100;
  }
  static analyzeTypeDistribution(openings) {
    const typeCounts = {};
    openings.forEach(o => {
      typeCounts[o.type] = (typeCounts[o.type] || 0) + 1;
    });
    return Object.entries(typeCounts).reduce((dist, [type, count]) => {
      dist[type] = (count / openings.length) * 100;
      return dist;
    }, {});
  }
  static evaluatePatterns(openings) {
    let score = 100;
    for (let i = 1; i < openings.length; i++) {
      if (openings[i].type === openings[i-1].type) {
        score -= 5;
      }
    }
    const typeDistribution = this.analyzeTypeDistribution(openings);
    Object.values(typeDistribution).forEach(percentage => {
      if (percentage > 30) {
        score -= (percentage - 30);
      }
    });
    return Math.max(0, score);
  }
  static analyzeTransitions(openings) {
    let score = 100;
    for (let i = 1; i < openings.length; i++) {
      const current = openings[i];
      const previous = openings[i-1];
      if (current.firstWord === previous.firstWord) {
        score -= 10;
      }
      if (current.type === previous.type) {
        score -= 5;
      }
      if (this.isGoodTransition(current.firstWord)) {
        score += 5;
      }
    }
    return Math.max(0, Math.min(100, score));
  }
  static calculateOverallScore(analysis) {
    const weights = {
      uniqueWordVariety: 0.3,
      phraseVariety: 0.25,
      patternQuality: 0.25,
      transitionStrength: 0.2
    };
    return Object.entries(weights).reduce((score, [metric, weight]) => {
      return score + (analysis[metric] * weight);
    }, 0);
  }
  static getImpactWords() {
    return new Set([
      'significantly', 'dramatically', 'fundamentally',
      'crucially', 'essentially', 'notably', 'remarkably'
    ]);
  }
  static isGoodTransition(word) {
    return [
      'however', 'moreover', 'furthermore', 'additionally',
      'consequently', 'therefore', 'nevertheless', 'alternatively'
    ].includes(word.toLowerCase());
  }
  static evaluateConnectionToMain(words, fullSentence) {
    const mainClause = fullSentence.split(',')[0];
    return words.some(word => 
      mainClause.toLowerCase().includes(word.toLowerCase())
    );
  }
  static generateSuggestions(analysis, openings) {
    const suggestions = [];
    const uniqueVariety = this.calculateUniqueWordVariety(openings);
    if (uniqueVariety < 50) {
      suggestions.push("Increase the variety in your sentence openings for better engagement.");
    }
    return suggestions;
  }
}

// more sentiment 
class EnhancedSentimentAnalyzer {
  constructor() {
    this.positiveWords = {
      'excellent': 2.0,
      'outstanding': 2.0,
      'exceptional': 2.0,
      'superb': 2.0,
      'fantastic': 2.0,
      'amazing': 2.0,
      'wonderful': 2.0,
      'brilliant': 2.0,
      'good': 1.5,
      'great': 1.5,
      'effective': 1.5,
      'positive': 1.5,
      'successful': 1.5,
      'beneficial': 1.5,
      'valuable': 1.5,
      'efficient': 1.5,
      'better': 1.0,
      'improved': 1.0,
      'helpful': 1.0,
      'useful': 1.0,
      'nice': 1.0,
      'decent': 1.0,
      'satisfactory': 1.0
    };
    this.negativeWords = {
      'terrible': -2.0,
      'horrible': -2.0,
      'awful': -2.0,
      'disastrous': -2.0,
      'bad': -1.5,
      'poor': -1.5,
      'negative': -1.5,
      'problematic': -1.5,
      'disappointing': -1.0,
      'inferior': -1.0,
      'inadequate': -1.0
    };
    this.intensifiers = {
      'very': 1.5,
      'extremely': 2.0,
      'highly': 1.75,
      'incredibly': 2.0,
      'really': 1.5,
      'particularly': 1.25,
      'absolutely': 2.0,
      'truly': 1.5
    };
    this.negations = new Set([
      'not', 'no', 'never', 'neither', 'nor', 'none', 'nothing',
      'nowhere', 'hardly', 'scarcely', 'barely', "doesn't", "don't",
      "didn't", "wasn't", "weren't", "haven't", "hasn't", "hadn't"
    ]);
  }
  analyzeSentiment(text) {
    const sentences = text.toLowerCase()
      .replace(/[^\w\s.!?]/g, '')
      .split(/[.!?]+/)
      .filter(Boolean);
    let totalScore = 0;
    let weightedWordCount = 0;
    const sentimentDetails = [];
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      let sentenceScore = 0;
      let isNegated = false;
      let intensifierMultiplier = 1;
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (this.negations.has(word)) {
          isNegated = true;
          continue;
        }
        if (this.intensifiers[word]) {
          intensifierMultiplier = this.intensifiers[word];
          continue;
        }
        let wordScore = 0;
        if (this.positiveWords[word]) {
          wordScore = this.positiveWords[word] * intensifierMultiplier;
          weightedWordCount++;
        } else if (this.negativeWords[word]) {
          wordScore = this.negativeWords[word] * intensifierMultiplier;
          weightedWordCount++;
        }
        if (isNegated) {
          wordScore *= -1;
          isNegated = false;
        }
        sentenceScore += wordScore;
        intensifierMultiplier = 1;
      }
      totalScore += sentenceScore;
      if (sentenceScore !== 0) {
        sentimentDetails.push({
          sentence: sentence.trim(),
          score: sentenceScore
        });
      }
    });
    const averageScore = weightedWordCount > 0 ? totalScore / weightedWordCount : 0;
    const normalizedScore = this.normalizeScore(averageScore);
    return {
      sentiment: this.getSentimentLabel(normalizedScore),
      score: normalizedScore,
      details: sentimentDetails,
      metrics: {
        totalScore,
        weightedWordCount,
        averageScore
      }
    };
  }
  normalizeScore(score) {
    return Math.min(100, Math.max(0, (score + 2) * 25));
  }
  getSentimentLabel(normalizedScore) {
    if (normalizedScore >= 75) return 'Very Positive';
    if (normalizedScore >= 60) return 'Positive';
    if (normalizedScore >= 40) return 'Neutral';
    if (normalizedScore >= 25) return 'Negative';
    return 'Very Negative';
  }
}

// just all these analyzers
class EnhancedVocabularyAnalyzer {
  static analyzeVocabularyDiversity(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words);
    const normalizedTTR = ((uniqueWords.size / words.length) * 100).toFixed(1);
    const windowSize = Math.min(100, Math.floor(words.length / 3));
    const windows = [];
    for (let i = 0; i < words.length - windowSize; i += windowSize / 2) {
      const windowSlice = words.slice(i, i + windowSize);
      const windowUnique = new Set(windowSlice).size;
      windows.push(windowUnique / windowSize);
    }
    return {
      basic: normalizedTTR,
      moving: (mean(windows) * 100).toFixed(1),
      root: Math.sqrt((uniqueWords.size / words.length) * 100).toFixed(1),
      details: {
        uniqueWords: uniqueWords.size,
        totalWords: words.length
      },
      interpretation: ""
    };
  }
}
function mean(arr) {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

class EnhancedSentenceVarietyAnalyzer {
  static analyzeSentenceVariety(text) {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    if (sentences.length === 0) return this.getDefaultMetrics();
    const metrics = {
      lengths: this.analyzeLengths(sentences),
      structure: this.analyzeStructure(sentences),
      openings: this.analyzeOpenings(sentences),
      rhythm: this.analyzeRhythm(sentences),
      composite: 0
    };
    metrics.composite = this.calculateCompositeScore(metrics);
    return metrics;
  }
  static analyzeLengths(sentences) {
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);
    return {
      score: Math.min(100, (stdDev / avg) * 100),
      details: {
        average: avg.toFixed(1),
        shortest: Math.min(...lengths),
        longest: Math.max(...lengths),
        stdDev: stdDev.toFixed(2),
        distribution: this.getLengthDistribution(lengths)
      }
    };
  }
  static analyzeStructure(sentences) {
    const patterns = {
      simple: /^[^,;:]+$/,
      compound: /\band\b|\bor\b|\bbut\b/,
      complex: /\bbecause\b|\bsince\b|\balthough\b|\bwhen\b|\bif\b/,
      compoundComplex: /(?:\band\b|\bor\b|\bbut\b).*(?:\bbecause\b|\bsince\b|\balthough\b|\bwhen\b|\bif\b)/
    };
    const counts = {
      simple: 0,
      compound: 0,
      complex: 0,
      compoundComplex: 0
    };
    sentences.forEach(sentence => {
      if (patterns.compoundComplex.test(sentence)) counts.compoundComplex++;
      else if (patterns.complex.test(sentence)) counts.complex++;
      else if (patterns.compound.test(sentence)) counts.compound++;
      else if (patterns.simple.test(sentence)) counts.simple++;
    });
    const varietyScore = this.calculateStructureScore(counts, sentences.length);
    return {
      score: varietyScore,
      details: counts
    };
  }
  static analyzeOpenings(sentences) {
    const openings = sentences.map(s => {
      const words = s.trim().split(/\s+/);
      return {
        firstWord: words[0].toLowerCase(),
        type: this.getOpeningType(words[0], words[1])
      };
    });
    const uniqueOpenings = new Set(openings.map(o => o.firstWord)).size;
    const typeVariety = new Set(openings.map(o => o.type)).size;
    return {
      score: Math.min(100, (uniqueOpenings / sentences.length) * 100),
      details: {
        uniqueCount: uniqueOpenings,
        typeVariety,
        types: this.countOpeningTypes(openings)
      }
    };
  }
  static analyzeRhythm(sentences) {
    let rhythmScore = 0;
    for (let i = 1; i < sentences.length; i++) {
      const curr = sentences[i].trim().split(/\s+/).length;
      const prev = sentences[i - 1].trim().split(/\s+/).length;
      const difference = Math.abs(curr - prev);
      rhythmScore += Math.min(difference * 5, 20);
    }
    return {
      score: Math.min(100, rhythmScore / sentences.length),
      details: {
        rhythmPatterns: this.analyzeRhythmPatterns(sentences)
      }
    };
  }
  static calculateCompositeScore(metrics) {
    return Math.round(
      metrics.lengths.score * 0.3 +
      metrics.structure.score * 0.3 +
      metrics.openings.score * 0.2 +
      metrics.rhythm.score * 0.2
    );
  }
  static getLengthDistribution(lengths) {
    return {
      short: lengths.filter(l => l < 10).length,
      medium: lengths.filter(l => l >= 10 && l <= 20).length,
      long: lengths.filter(l => l > 20).length
    };
  }
  static getOpeningType(firstWord, secondWord) {
    const patterns = {
      subject: /^(?:the|a|an|this|that|these|those|my|your|his|her|its|our|their)\b/i,
      verb: /^(?:is|are|was|were|have|has|had|do|does|did|will|would|shall|should|may|might|must|can|could)\b/i,
      preposition: /^(?:in|on|at|to|for|with|by|from|of|under|over)\b/i,
      conjunction: /^(?:and|but|or|nor|yet|so|if|then|while|because)\b/i,
      adverb: /^(?:quickly|slowly|carefully|suddenly|finally|unfortunately|surprisingly)\b/i
    };
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(firstWord)) return type;
    }
    return 'other';
  }
  static countOpeningTypes(openings) {
    const counts = {};
    openings.forEach(o => {
      counts[o.type] = (counts[o.type] || 0) + 1;
    });
    return counts;
  }
  static analyzeRhythmPatterns(sentences) {
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    let pattern = '';
    for (let i = 1; i < lengths.length; i++) {
      if (lengths[i] > lengths[i - 1]) pattern += '↑';
      else if (lengths[i] < lengths[i - 1]) pattern += '↓';
      else pattern += '→';
    }
    return pattern;
  }
  static calculateStructureScore(counts, total) {
    if (total === 0) return 0;
    const percentages = {
      simple: (counts.simple / total) * 100,
      compound: (counts.compound / total) * 100,
      complex: (counts.complex / total) * 100,
      compoundComplex: (counts.compoundComplex / total) * 100
    };
    const ideal = {
      simple: 30,
      compound: 30,
      complex: 30,
      compoundComplex: 10
    };
    const deviation = Object.keys(ideal).reduce((sum, type) => sum + Math.abs(ideal[type] - percentages[type]), 0);
    return Math.max(0, 100 - deviation);
  }
  static getDefaultMetrics() {
    return {
      lengths: { score: 0, details: { average: 0, shortest: 0, longest: 0, stdDev: 0, distribution: { short: 0, medium: 0, long: 0 } } },
      structure: { score: 0, details: { simple: 0, compound: 0, complex: 0, compoundComplex: 0 } },
      openings: { score: 0, details: { uniqueCount: 0, typeVariety: 0, types: {} } },
      rhythm: { score: 0, details: { rhythmPatterns: '' } },
      composite: 0
    };
  }
}

class ReadingTimeAnalyzer {
  static calculateReadingTimeDistribution(text) {
    const stats = this.getTextStatistics(text);
    const averageReadingWPM = 238;
    const complexityFactor = this.getComplexityFactor(stats);
    const baseReadingTime = (stats.wordCount / averageReadingWPM) * 60;
    const adjustedReadingTime = baseReadingTime * complexityFactor;
    return {
      quick: this.calculateQuickReadTime(stats, adjustedReadingTime),
      medium: this.calculateMediumReadTime(stats, adjustedReadingTime),
      thorough: this.calculateThoroughReadTime(stats, adjustedReadingTime),
      metrics: {
        estimatedMinutes: Math.ceil(adjustedReadingTime / 60),
        wordsPerMinute: Math.round(stats.wordCount / (adjustedReadingTime / 60)),
        complexity: complexityFactor.toFixed(2)
      }
    };
  }
  static getTextStatistics(text) {
    const words = text.match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const complexWords = words.filter(word => this.countSyllables(word) > 2);
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      complexWordCount: complexWords.length,
      avgWordLength: words.reduce((sum, word) => sum + word.length, 0) / (words.length || 1),
      avgSentenceLength: words.length / (sentences.length || 1)
    };
  }
  static getComplexityFactor(stats) {
    const complexityFactors = {
      complexWordRatio: (stats.complexWordCount / (stats.wordCount||1)) * 0.4,
      sentenceLength: Math.min(1, stats.avgSentenceLength / 20) * 0.3,
      wordLength: Math.min(1, stats.avgWordLength / 6) * 0.3
    };
    return 1 + Object.values(complexityFactors).reduce((a, b) => a + b, 0);
  }
  static calculateQuickReadTime(stats, baseTime) {
    return {
      percentage: Math.min(100, (stats.wordCount / 500) * 100),
      timeInSeconds: Math.round(baseTime * 0.7)
    };
  }
  static calculateMediumReadTime(stats, baseTime) {
    return {
      percentage: Math.min(100, (stats.wordCount / 1000) * 100),
      timeInSeconds: Math.round(baseTime)
    };
  }
  static calculateThoroughReadTime(stats, baseTime) {
    return {
      percentage: Math.max(
        0,
        100 - Math.min(100, (stats.wordCount / 500) * 100) - Math.min(100, (stats.wordCount / 1000) * 100)
      ),
      timeInSeconds: Math.round(baseTime * 1.3)
    };
  }
  static countSyllables(word) {
    word = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
    return (word.match(/[aeiouy]{1,2}/g) || []).length;
  }
}

/**************************************************************************
 * Complexity logic: i did scale down the calculations checked
 **************************************************************************/
function calculateVocabularyScore(words) {
  return Math.min(100, (new Set(words).size / words.length) * 100);
}

function calculateSentenceComplexity(sentences) {
  const avgLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / (sentences.length || 1);
  return Math.min(100, (avgLength / 30) * 100);
}

function calculateStructureScore(sentences) {
  const complexSentences = sentences.filter(s => s.includes(',') || s.includes(';') || s.includes(':')).length;
  return Math.min(100, (complexSentences / (sentences.length || 1)) * 80);
}

function calculateReadabilityIndex(words, sentences) {
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSentenceLength = words.length / (sentences.length || 1);
  const avgSyllablesPerWord = totalSyllables / (words.length || 1);
  const flesch = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  return Math.max(0, Math.min(100, flesch));
}

function calculateTechnicalDensity(words) {
  const technicalTermsCount = words.filter(w => w.length > 6 || /^[A-Z]/.test(w) || w.includes('-')).length;
  return Math.min(100, (technicalTermsCount / (words.length || 1)) * 100);
}

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if(word.length <= 3) return 1;
  const matches = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
                      .replace(/^y/, '')
                      .match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function calculateLexicalDensity(text) {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const functionWords = new Set([
    'a', 'an', 'the',
    'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'of', 'under', 'over',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
    'may', 'might', 'must', 'and', 'but', 'or', 'nor', 'yet', 'so', 'if', 'then', 'while', 'because',
    'than', 'that', 'this', 'these', 'those', 'such', 'what', 'who', 'which'
  ]);
  let contentWords = 0;
  let functionWordCount = 0;
  words.forEach(word => {
    if (functionWords.has(word)) {
      functionWordCount++;
    } else {
      contentWords++;
    }
  });
  const total = contentWords + functionWordCount;
  const density = total > 0 ? (contentWords / total) * 100 : 0;
  return {
    contentWords,
    functionWordCount,
    total,
    density: parseFloat(density.toFixed(2))
  };
}

class WritingStyleAnalyzer {
  static analyzeWritingStyleEvolution(text) {
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
    const labels = [];
    const data = [];
    paragraphs.forEach((paragraph, idx) => {
      if (!paragraph.trim() || paragraph.split(/\s+/).length < 3) return;
      const words = paragraph.toLowerCase().match(/\b\w+\b/g) || [];
      const sentences = paragraph.split(/[.!?]+/).filter(Boolean);
      if (sentences.length === 0 || words.length === 0) return;
      const syllables = words.reduce((sum, word) => {
        const count = (word.toLowerCase().match(/[aeiouy]{1,2}/g) || []).length;
        return sum + (count || 1);
      }, 0);
      const avgSentenceLength = words.length / sentences.length;
      const avgSyllablesPerWord = syllables / words.length;
      const readabilityScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
      if (isFinite(readabilityScore) && !isNaN(readabilityScore)) {
        labels.push(`Para ${idx + 1}`);
        data.push(Math.max(0, Math.min(100, readabilityScore)));
      }
    });
    return { labels, data };
  }
}

/*****************************************************************
 * SmartDocProEngine (main)
 *****************************************************************/
class SmartDocProEngine {
  constructor() {
    this.readabilityLevels = {
      easy: { max: 8, color: '#22c55e' },
      medium: { max: 12, color: '#f59e0b' },
      hard: { max: 16, color: '#ef4444' }
    };
    this.commonPhrases = new Set([
      'in order to','due to the fact that','in spite of',
      'with regard to','in the event that','by virtue of',
      'for the purpose of','in the course of','in the process of'
    ]);
    this.functionWords = new Set([
      'the','and','is','in','at','of','a','an','to','it','for','on',
      'with','as','by','that','this','from','but','be','are','was',
      'were','or','which','you','your','their','they','them','he',
      'she','his','her','its','we','us','our','i','me','my','mine',
      'have','has','had','do','does','did','will','would','can',
      'could','should','shall','may','might','must','been','being'
    ]);
    this.contentWords = new Set([
      'document','analysis','tool','feature','algorithm','system','data',
      'performance','implementation','structure','readability','complexity',
      'insight','suggestion','metric','chart','development','technology',
      'capability','intelligence','content','function','word','proportion',
      'pattern','trend','method','process','effect','impact',
      'research','study','evaluation','assessment','discussion',
      'framework','model','concept','evidence','argument'
    ]);
    this.initializeCharts();
  }
  initializeCharts() {
    const readingCtx = document.getElementById('readingTimeChart').getContext('2d');
    this.readingTimeChart = new Chart(readingCtx, {
      type: 'doughnut',
      data: {
        labels: ['Quick Read','Medium Read','Thorough Read'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#22c55e','#f59e0b','#ef4444']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
    const complexityCtx = document.getElementById('complexityChart').getContext('2d');
    this.complexityChart = new Chart(complexityCtx, {
      type: 'radar',
      data: {
        labels: ['Vocabulary', 'Sentence Length', 'Structure', 'Readability', 'Technical'],
        datasets: [{
          label: 'Document Complexity',
          data: [0, 0, 0, 0, 0],
          backgroundColor: 'rgba(79, 70, 229, 0.3)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 2,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(79, 70, 229, 1)',
          pointHoverRadius: 6,
          pointRadius: 4
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: { stepSize: 20 },
            grid: { color: 'rgba(0, 0, 0, 0.1)', circular: true },
            angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
            pointLabels: { font: { weight: '600' } }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(1)}`
            }
          }
        }
      }
    });
    const transitionCtx = document.getElementById('transitionChart').getContext('2d');
    this.transitionChart = new Chart(transitionCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Readability Score Over Sections',
          data: [],
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          x: { title: { display: true, text: 'Section' } },
          y: { title: { display: true, text: 'Readability Score' }, suggestedMin: 0, suggestedMax: 100 }
        }
      }
    });
    const lexicalCtx = document.getElementById('lexicalDensityChart').getContext('2d');
    this.lexicalDensityChart = new Chart(lexicalCtx, {
      type: 'doughnut',
      data: {
        labels: ['Content Words','Function Words'],
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#4f46e5','#ef4444'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.chart._metasets[context.datasetIndex].total;
                const percentage = ((value / total) * 100).toFixed(2);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  analyzeDocument(text) {
    const words = this.getWords(text);
    const sentences = this.getSentences(text);
    const paragraphs = this.getParagraphs(text);
    const syllables = this.countTotalSyllables(words);
    const readabilityScore = this.calculateReadabilityScore(words, sentences, syllables);
    const grade = this.calculateFleschKincaidGrade(words, sentences, syllables);
    
    // FIXED Complexity
    const complexity = this.assessComplexity(words, sentences);
    
    const structure = this.analyzeStructure(text);
    const style = this.analyzeStyle(text);
    const sentiment = this.analyzeSentiment(text);
    const writingStyleEvolution = this.analyzeWritingStyleEvolution(paragraphs);
    const lexicalStats = calculateLexicalDensity(text);
    const lexicalDensity = {
      contentWords: lexicalStats.contentWords,
      functionWordCount: lexicalStats.functionWordCount,
      density: lexicalStats.density
    };
    this.updateCharts(text, complexity, writingStyleEvolution, lexicalDensity);

    return {
      basic: {
        words: words.length,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        chars: text.length,
        avgWordLength: (text.length / (words.length || 1)).toFixed(1)
      },
      readability: {
        score: readabilityScore,
        grade: grade,
        level: this.getReadabilityLevel(readabilityScore),
        avgSentenceLength: (words.length / (sentences.length || 1)).toFixed(1),
        avgSyllablesPerWord: (syllables / (words.length || 1)).toFixed(2)
      },
      complexity,
      structure,
      style,
      sentiment,
      writingStyleEvolution,
      lexicalDensity,
      readingTime: ReadingTimeAnalyzer.calculateReadingTimeDistribution(text).metrics
    };
  }

  assessComplexity(words, sentences) {
    return {
      vocabularyScore: calculateVocabularyScore(words),
      sentenceScore: calculateSentenceComplexity(sentences),
      structureScore: calculateStructureScore(sentences),
      readabilityScore: calculateReadabilityIndex(words, sentences),
      technicalScore: calculateTechnicalDensity(words),
      complexWords: words.filter(w => countSyllables(w) > 2).length,
      averageWordLength: words.reduce((sum, w) => sum + w.length, 0) / (words.length || 1)
    };
  }

  calculateFleschKincaidGrade(words, sentences, syllables) {
    const gradeLevel = 0.39 * (words.length / (sentences.length||1))
                    + 11.8 * (syllables / (words.length||1))
                    - 15.59;
    return gradeLevel.toFixed(1);
  }

  updateCharts(text, complexity, writingStyleData, lexicalDensity) {
    const readingTimeData = ReadingTimeAnalyzer.calculateReadingTimeDistribution(text);
    const normalizedReadingData = normalizeReadingTimeData(
      readingTimeData.quick.percentage,
      readingTimeData.medium.percentage,
      readingTimeData.thorough.percentage
    );
    ChartPerformanceMonitor.measureUpdateTime('readingTimeChart', () => {
      this.readingTimeChart.data.datasets[0].data = normalizedReadingData;
      this.readingTimeChart.update();
    });

    const validatedComplexity = validateComplexityData(complexity);
    ChartPerformanceMonitor.measureUpdateTime('complexityChart', () => {
      this.complexityChart.data.datasets[0].data = [
        validatedComplexity.vocabulary,
        validatedComplexity.sentenceLength,
        validatedComplexity.structure,
        validatedComplexity.readability,
        validatedComplexity.technical
      ];
      this.complexityChart.update();
    });

    if (writingStyleData && writingStyleData.labels.length > 0) {
      const processedStyle = processWritingStyleData(writingStyleData.data, writingStyleData.labels);
      ChartPerformanceMonitor.measureUpdateTime('transitionChart', () => {
        this.transitionChart.data.labels = processedStyle.labels;
        this.transitionChart.data.datasets[0].data = processedStyle.data;
        this.transitionChart.update();
      });
    }

    const ldData = calculateLexicalDensityData(lexicalDensity.contentWords, lexicalDensity.functionWordCount);
    ChartPerformanceMonitor.measureUpdateTime('lexicalDensityChart', () => {
      this.lexicalDensityChart.data.datasets[0].data = ldData;
      this.lexicalDensityChart.update();
    });
  }

  analyzeStructure(text) {
    const paragraphs = this.getParagraphs(text);
    const sections = text.match(/#{1,6}\s+.+/g) || [];
    const lists = text.match(/(?:^|\n)[\s]*(?:[-*+]|\d+\.)\s+/gm) || [];
    return {
      sections: sections.length,
      lists: lists.length,
      paragraphLengths: paragraphs.map(p => p.split(' ').length),
      hasConclusion: this.hasConclusion(text),
      hasIntroduction: this.hasIntroduction(text)
    };
  }
  analyzeStyle(text) {
    const sentences = this.getSentences(text);
    const words = this.getWords(text);
    return {
      passiveVoice: this.detectPassiveVoice(text),
      repeatedWords: this.findRepeatedWords(words),
      longSentences: sentences.filter(s => s.split(' ').length > 25).length,
      complexPhrases: this.findComplexPhrases(text),
      tone: this.analyzeTone(text)
    };
  }
  analyzeSentiment(text) {
    const sentimentAnalyzer = new EnhancedSentimentAnalyzer();
    return sentimentAnalyzer.analyzeSentiment(text);
  }
  getWords(text) {
    return text.toLowerCase().match(/\b\w+\b/g) || [];
  }
  getSentences(text) {
    return text.split(/[.!?]+/).filter(Boolean);
  }
  getParagraphs(text) {
    return text.split(/\n\s*\n/).filter(Boolean);
  }
  countTotalSyllables(words) {
    return words.reduce((sum, w) => sum + countSyllables(w), 0);
  }
  calculateReadabilityScore(words, sentences, syllables) {
    const avgSentenceLength = words.length / (sentences.length || 1);
    const avgSyllablesPerWord = syllables / (words.length || 1);
    return (206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord).toFixed(1);
  }
  getReadabilityLevel(score) {
    if (score > 90) return 'Very Easy';
    if (score > 80) return 'Easy';
    if (score > 70) return 'Fairly Easy';
    if (score > 60) return 'Standard';
    if (score > 50) return 'Fairly Difficult';
    if (score > 30) return 'Difficult';
    return 'Very Difficult';
  }
  hasConclusion(text) {
    return /\b(?:in conclusion|to conclude|finally|in summary|to summarize)\b/i.test(text);
  }
  hasIntroduction(text) {
    return /\b(?:introduction|to begin with|initially|first of all|this document|this paper|this report|this analysis)\b/i.test(text);
  }
  detectPassiveVoice(text) {
    const passivePatterns = [
      /\b(?:am|is|are|was|were|be|been|being)\s+\w+ed\b/gi,
      /\b(?:has|have|had)\s+been\s+\w+ed\b/gi
    ];
    return passivePatterns.reduce((count, pattern) => count + (text.match(pattern) || []).length, 0);
  }
  findRepeatedWords(words) {
    const frequency = {};
    words.forEach(word => {
      if (word.length > 3) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    return Object.entries(frequency)
      .filter(([_, c]) => c > 3)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([w, c]) => ({ word: w, count: c }));
  }
  findComplexPhrases(text) {
    return Array.from(this.commonPhrases).filter(phrase => text.toLowerCase().includes(phrase)).length;
  }
  analyzeTone(text) {
    const formalIndicators = /\b(?:therefore|moreover|consequently|thus|hence|accordingly|furthermore|additionally|in addition|subsequently)\b/gi;
    const casualIndicators = /\b(?:like|basically|kind of|sort of|you know|stuff|things|okay)\b/gi;
    const formalCount = (text.match(formalIndicators) || []).length;
    const casualCount = (text.match(casualIndicators) || []).length;
    if (formalCount > casualCount * 2) return 'Formal';
    if (casualCount > formalCount * 2) return 'Casual';
    return 'Neutral';
  }
  analyzeWritingStyleEvolution(paragraphs) {
    const analysis = WritingStyleAnalyzer.analyzeWritingStyleEvolution(paragraphs.join('\n\n'));
    // Instead of updating the chart here, return the data for updateCharts 
    return analysis;
  }
  generateSuggestions(text, analysis) {
    const suggestions = [];
    if (analysis.readability.score < 60) {
      suggestions.push({
        icon: 'fa-book-reader',
        title: 'Improve Readability',
        content: 'Use shorter sentences and simpler words to make your content more accessible.'
      });
    }
    if (!analysis.structure.hasIntroduction) {
      suggestions.push({
        icon: 'fa-paragraph',
        title: 'Add Introduction',
        content: 'Start with a clear introduction to set context for your readers.'
      });
    }
    if (analysis.style.passiveVoice > 3) {
      suggestions.push({
        icon: 'fa-pen-fancy',
        title: 'Use Active Voice',
        content: 'Use more active voice to make your writing more direct.'
      });
    }
    const wordCount = analysis.basic.words;
    if (wordCount < 300 && !text.includes('conclusion')) {
      suggestions.push({
        icon: 'fa-expand-arrows-alt',
        title: 'Expand Content',
        content: 'Add more detail or examples to fully develop your ideas.'
      });
    }
    if (parseFloat(analysis.readability.grade) > 10) {
      suggestions.push({
        icon: 'fa-edit',
        title: 'Simplify Language',
        content: 'Your document appears complex. Consider using simpler words and shorter sentences for better accessibility.'
      });
    }
    return suggestions;
  }
}

/*****************************************************
 * AdditionalTextAnalyzer & ArgumentStrength checked 
 *****************************************************/
class AdditionalTextAnalyzer {
  constructor() {
    this.initCharts();
  }
  initCharts() {
    this.cohesionChart = new Chart('cohesionChart', {
      type: 'bar',
      options: { responsive: true },
      data: {
        datasets: [
          { label: 'Transitions', backgroundColor: '#4f46e5' },
          { label: 'References', backgroundColor: '#22c55e' },
          { label: 'Coherence', type: 'line', borderColor: '#f59e0b' }
        ]
      }
    });
    this.emotionalChart = new Chart('emotionalChart', {
      type: 'line',
      options: { responsive: true },
      data: {
        datasets: [
          { label: 'Positive', borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: true },
          { label: 'Negative', borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', fill: true }
        ]
      }
    });
    this.argumentChart = new Chart('argumentChart', {
      type: 'radar',
      options: {
        responsive: true,
        scales: {
          r: { beginAtZero: true, max: 100, min: 0 }
        }
      },
      data: {
        labels: ['Evidence','Logic','Support','Impact'],
        datasets: [
          { label: 'Metrics', backgroundColor: 'rgba(79, 70, 229, 0.2)', borderColor: 'rgba(79, 70, 229, 1)', data: [] }
        ]
      }
    });
  }
  analyze(text) {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    const labels = paragraphs.map((_, i) => `P${i + 1}`);
    const analysis = paragraphs.map(p => ({
      transitions: this.countTransitions(p),
      references: this.countReferences(p),
      coherence: this.calculateCoherence(p),
      sentiment: this.analyzeSentiment(p)
    }));
    // Normalized cohesion chart data using helper function:
    const transitionsArr = analysis.map(a => a.transitions);
    const referencesArr = analysis.map(a => a.references);
    const coherenceArr = analysis.map(a => a.coherence);
    const normalizedCohesion = normalizeCohesionData(transitionsArr, referencesArr, coherenceArr);
    this.cohesionChart.data.labels = labels;
    this.cohesionChart.data.datasets[0].data = normalizedCohesion.transitions;
    this.cohesionChart.data.datasets[1].data = normalizedCohesion.references;
    this.cohesionChart.data.datasets[2].data = normalizedCohesion.coherence;
    this.cohesionChart.update();

    this.emotionalChart.data.labels = labels;
    this.emotionalChart.data.datasets[0].data = analysis.map(a => a.sentiment.positive);
    this.emotionalChart.data.datasets[1].data = analysis.map(a => a.sentiment.negative);
    this.emotionalChart.update();

    const improvedAnalyzer = new ImprovedArgumentStrengthAnalyzer();
    const metrics = improvedAnalyzer.calculateMetrics(analysis);
    this.argumentChart.data.datasets[0].data = [
      metrics.evidence,
      metrics.logic,
      metrics.support,
      metrics.impact
    ];
    this.argumentChart.update();
  }
  countTransitions(text) {
    const transitions = [
      'however','therefore','furthermore','moreover','nevertheless',
      'in addition','besides','similarly','subsequently','conversely',
      'accordingly','alternatively','indeed','likewise'
    ];
    return transitions.reduce(
      (count, word) => count + ((text.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g'))) || []).length,
      0
    );
  }
  countReferences(text) {
    const refs = [/\[\d+\]/g, /\([^)]+\d{4}\)/g, /\b(?:et al\.|ibid\.)\b/gi, /"[^"]+"/g];
    return refs.reduce((count, pattern) => count + ((text.match(pattern) || []).length), 0);
  }
  calculateCoherence(text) {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const avgLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / (sentences.length || 1);
    const transitions = this.countTransitions(text);
    return Math.min(100, 50 + transitions * 8 + (20 - Math.abs(15 - avgLength)));
  }
  analyzeSentiment(text) {
    const words = text.toLowerCase().split(/\W+/);
    const positive = ['good','great','excellent','positive','success','benefit'];
    const negative = ['bad','poor','negative','problem','difficult','risk'];
    return {
      positive: words.filter(w => positive.includes(w)).length * 10,
      negative: words.filter(w => negative.includes(w)).length * 10
    };
  }
}

class ImprovedArgumentStrengthAnalyzer {
  calculateMetrics(analysis) {
    const evidenceScore = this.calculateEvidenceScore(analysis);
    const logicScore = this.calculateLogicScore(analysis);
    const supportScore = this.calculateSupportScore(analysis);
    const impactScore = this.calculateImpactScore(evidenceScore, logicScore, supportScore);
    return {
      evidence: Math.round(evidenceScore),
      logic: Math.round(logicScore),
      support: Math.round(supportScore),
      impact: Math.round(impactScore)
    };
  }
  calculateEvidenceScore(analysis) {
    const citations = analysis.reduce((sum, a) => sum + a.references, 0);
    const paragraphCount = analysis.length || 1;
    const citationDensity = citations / paragraphCount;
    return Math.min(100, citationDensity * 30);
  }
  calculateLogicScore(analysis) {
    const avgCoherence = analysis.reduce((sum, a) => sum + a.coherence, 0) / (analysis.length || 1);
    const transitionStrength = this.evaluateTransitions(analysis);
    return (avgCoherence * 0.5) + (transitionStrength * 0.5);
  }
  calculateSupportScore(analysis) {
    const transitions = analysis.reduce((sum, a) => sum + a.transitions, 0);
    const paragraphCount = analysis.length || 1;
    const transitionDensity = transitions / paragraphCount;
    return Math.min(100, transitionDensity * 30);
  }
  calculateImpactScore(evidence, logic, support) {
    return (evidence * 0.35) + (logic * 0.4) + (support * 0.25);
  }
  evaluateTransitions(analysis) {
    const totalTransitions = analysis.reduce((sum, a) => sum + a.transitions, 0);
    const paragraphCount = analysis.length || 1;
    return Math.min(100, (totalTransitions / (paragraphCount * 2)) * 100);
  }
}

function analyzeDocumentContext(text, analysis) {
  const semanticPatterns = {
    tone: {
      formal: /\b(?:furthermore|moreover|consequently|therefore|thus|hence|accordingly|additionally|in addition|subsequently)\b/gi,
      casual: /\b(?:basically|actually|pretty|kind of|sort of|you know|stuff|things|okay)\b/gi,
      technical: /\b(?:implementation|methodology|algorithm|framework|infrastructure)\b/gi
    },
    structure: {
      argumentative: /\b(?:however|although|despite|argue|support|evidence|contrary|but|yet|nevertheless|on the contrary)\b/gi,
      descriptive: /\b(?:appears|seems|looks|feels|sounds|represents|shows)\b/gi,
      analytical: /\b(?:analyze|examine|investigate|evaluate|assess|measure|scrutinize|appraise|explore|review|interpret)\b/gi
    },
    purpose: {
      informative: /\b(?:explain|describe|outline|present|introduce|overview|clarify|delineate)\b/gi,
      persuasive: /\b(?:should|must|need|recommend|suggest|propose|consider)\b/gi,
      instructional: /\b(?:step|guide|instruction|process|procedure|method|tutorial|directions)\b/gi
    }
  };
  const semanticAnalysis = {};
  for (const [category, patterns] of Object.entries(semanticPatterns)) {
    semanticAnalysis[category] = {};
    for (const [type, pattern] of Object.entries(patterns)) {
      semanticAnalysis[category][type] = (text.match(pattern) || []).length;
    }
  }
  const patterns = {
    technical: {
      keywords: /\b(?:code|api|function|data|implementation|system|algorithm|interface|module|database)\b/gi,
      structure: /\b(?:class|method|function|return|import|export)\b/gi,
      weight: 1.2
    },
    academic: {
      keywords: /\b(?:research|study|analysis|theory|hypothesis|methodology|findings|literature|empirical)\b/gi,
      citations: /\(\w+\s*(?:et al\.?)?,\s*\d{4}\)|(?:\[[\d,\s]+\])/gi,
      weight: 1.1
    },
    business: {
      keywords: /\b(?:market|strategy|revenue|customer|profit|ROI|stakeholder|investment|growth)\b/gi,
      metrics: /\b(?:\d+(?:\.\d+)?%|(?:\$|€|£)\d+(?:,\d{3})*(?:\.\d{2})?)\b/g,
      weight: 1.0
    },
    creative: {
      keywords: /\b(?:story|character|plot|scene|dialogue|setting|theme|narrative|conflict)\b/gi,
      literary: /["'](?:[^"'\\]|\\.)*["']|\b(?:metaphor|symbolism|imagery)\b/gi,
      weight: 1.0
    },
    scientific: {
      keywords: /\b(?:experiment|observation|hypothesis|data|analysis|results|conclusion|method)\b/gi,
      formulas: /\b(?:[A-Z][a-z]*\d*(?:\s*[+\-=]\s*[A-Z][a-z]*\d*)+|\d+\s*(?:[+\-*/]\s*\d+)+)\b/g,
      weight: 1.3
    },
    legal: {
      keywords: /\b(?:pursuant|herein|thereof|agreement|contract|party|clause|provision)\b/gi,
      references: /\b(?:Section|Article|Clause)\s+\d+(?:\.\d+)*\b/gi,
      weight: 1.2
    },
    educational: {
      keywords: /\b(?:learn|teach|student|concept|exercise|practice|understand|explain)\b/gi,
      structure: /\b(?:chapter|lesson|module|quiz|assignment|objective)\b/gi,
      weight: 1.1
    }
  };
  const scores = {};
  for (const [type, config] of Object.entries(patterns)) {
    const keywordMatches = (text.match(config.keywords) || []).length;
    const secondaryMatches = (text.match(config.structure || config.citations || config.metrics || config.literary) || []).length;
    scores[type] = (keywordMatches * 2 + secondaryMatches) * config.weight;
  }
  const toneProfile = Object.entries(semanticAnalysis.tone).sort(([,a], [,b]) => b - a)[0][0];
  const structureType = Object.entries(semanticAnalysis.structure).sort(([,a], [,b]) => b - a)[0][0];
  const purposeType = Object.entries(semanticAnalysis.purpose).sort(([,a], [,b]) => b - a)[0][0];
  const contentComplexity = analysis.complexity.readabilityScore;
  const avgSentenceLength = analysis.readability.avgSentenceLength;
  return {
    primaryType: Object.entries(scores).sort(([,a], [,b]) => b - a)[0][0],
    scores,
    context: {
      tone: toneProfile,
      structure: structureType,
      purpose: purposeType,
      complexity: contentComplexity,
      sentenceLength: avgSentenceLength
    },
    semanticAnalysis
  };
}

function generateSmartSuggestions(text, analysis, documentContext) {
  const suggestions = [];
  const { readability, complexity, structure, style } = analysis;
  const { primaryType, scores } = documentContext;
  if (!structure.hasIntroduction && scores[primaryType] > 5) {
    suggestions.push(generateIntroduction(primaryType));
  }
  suggestions.push(...generateContentSuggestions(primaryType, analysis, documentContext.context));
  if (style.passiveVoice > 3 || readability.score < 60) {
    suggestions.push(...generateStyleSuggestions(analysis, documentContext.context));
  }
  return formatSuggestions(suggestions, primaryType, documentContext.context);
}

function generateIntroduction(docType) {
  const introTemplates = {
    technical: "## Technical Overview\nThis document outlines the technical specifications and implementation details of [System Name]. Key areas covered include:\n- Architecture overview\n- System components\n- Implementation approach",
    academic: "## Research Abstract\nThis study investigates [Research Topic] through [Methodology]. The research addresses:\n- Current gaps in literature\n- Methodology approach\n- Key findings and implications",
    business: "## Executive Summary\nThis proposal presents a comprehensive business strategy for [Project/Initiative]. Focus areas include:\n- Market opportunity\n- Strategic approach\n- Expected outcomes",
    creative: "## Story Synopsis\nThis narrative explores [Theme/Concept] through [Style/Approach]. Key elements include:\n- Main character arc\n- Central conflict\n- Theme development"
  };
  return introTemplates[docType] || introTemplates.technical;
}

function generateContentSuggestions(docType, analysis, context) {
  const { tone, structure, purpose } = context;
  const shouldSimplify = context.complexity < 50 || context.sentenceLength > 25;
  const contentTemplates = {
    technical: [
      "## Implementation Considerations\n- Performance optimization strategies\n- Scalability approaches\n- Security considerations\n- Testing methodology",
      "## System Architecture\n1. Component interactions\n2. Data flow\n3. Integration points\n4. Deployment strategy"
    ],
    academic: [
      "## Methodology\n- Research design\n- Data collection approach\n- Analysis framework\n- Validation methods",
      "## Literature Review\n1. Current state of research\n2. Theoretical framework\n3. Research gaps\n4. Contribution to field"
    ],
    business: [
      "## Market Analysis\n- Target market segmentation\n- Competitive landscape\n- Growth opportunities\n- Risk assessment",
      "## Implementation Strategy\n1. Phase 1: [Timeline]\n2. Phase 2: [Timeline]\n3. Resource allocation\n4. Success metrics"
    ],
    creative: [
      "## Character Development\n- Psychological profile\n- Character relationships\n- Growth arc\n- Conflict resolution",
      "## Plot Structure\n1. Inciting incident\n2. Rising action\n3. Climax\n4. Resolution approach"
    ],
    scientific: [
      "## Methodology\n- Experimental design\n- Variables and controls\n- Data collection protocol\n- Statistical analysis approach",
      "## Results and Discussion\n1. Primary findings\n2. Statistical significance\n3. Implications\n4. Future research directions"
    ],
    legal: [
      "## Legal Framework\n- Applicable regulations\n- Precedent cases\n- Statutory requirements\n- Compliance considerations",
      "## Risk Assessment\n1. Potential liabilities\n2. Mitigation strategies\n3. Recommended safeguards\n4. Compliance timeline"
    ],
    educational: [
      "## Learning Objectives\n- Key concepts\n- Skill development goals\n- Assessment criteria\n- Practice exercises",
      "## Module Structure\n1. Prerequisite knowledge\n2. Core content sections\n3. Interactive elements\n4. Assessment methods"
    ]
  };
  let template = contentTemplates[docType][Math.floor(Math.random() * contentTemplates[docType].length)];
  if (tone === 'formal' && purpose === 'persuasive') {
    template = template.replace(/^##/gm, '### Recommendation:');
  } else if (purpose === 'instructional') {
    template = template.replace(/^-/gm, '✓');
  }
  if (shouldSimplify) {
    template = template.replace(/\n(?:-|\d+\.)\s+([^\n]+)/g, '\n• $1');
  }
  return [template];
}

function generateStyleSuggestions(analysis, context) {
  const suggestions = [];
  const { readability, style, complexity } = analysis;
  const { tone, structure, purpose } = context;
  if (style.passiveVoice > 3 && tone !== 'formal') {
    suggestions.push("## Style Enhancement\nConsider revising passive voice constructions for more direct impact:\n- [Example passive sentence]\n- Alternative active voice: [Example active sentence]");
  }
  if (tone === 'casual' && purpose === 'informative') {
    suggestions.push("## Tone Adjustment\nConsider adopting a more professional tone:\n- Replace casual phrases with formal alternatives\n- Maintain consistent terminology\n- Use precise language");
  }
  if (structure === 'argumentative' && style.repeatedWords.length > 3) {
    suggestions.push("## Argument Strength\nEnhance your arguments by:\n- Using varied vocabulary for key concepts\n- Adding supporting evidence\n- Strengthening transitions between points");
  }
  if (readability.score < 60) {
    const readabilityTips = {
      informative: '- Break into smaller, focused paragraphs\n- Add subheadings for clarity\n- Use bullet points for key information',
      persuasive: '- Strengthen topic sentences\n- Add concrete examples\n- Use impactful statistics',
      instructional: '- Break into step-by-step format\n- Add practical examples\n- Include review points'
    };
    suggestions.push(`## Readability Improvements
- Simplify sentences (current average: ${readability.avgSentenceLength} words)
${readabilityTips[purpose] || readabilityTips.informative}`);
  }
  return suggestions;
}

function formatSuggestions(suggestions, docType, context) {
  const { tone, purpose, complexity } = context;
  const header = `
# Enhanced Content Suggestions
_Analysis Results:_
- Document Type: ${docType}
- Writing Style: ${tone}
- Primary Purpose: ${purpose}
- Complexity Level: ${complexity < 50 ? 'Basic' : complexity < 75 ? 'Intermediate' : 'Advanced'}
`;
  return header + suggestions.join('\n\n');
}

async function suggestContinuation() {
  const text = editor.value;
  if (!text.trim()) {
    showToast('Please enter some text first', 'error');
    return;
  }
  showToast('Generating intelligent suggestions...', 'info');
  showLoading(true);
  try {
    const analysis = engine.analyzeDocument(text);
    const documentContext = analyzeDocumentContext(text, analysis);
    const suggestions = generateSmartSuggestions(text, analysis, documentContext);
    editor.value += suggestions;
    editor.scrollTop = editor.scrollHeight;
    updatePreview(editor.value);
    snippetAnalyzer.analyze(editor.value);
    showToast('Enhanced suggestions added!', 'success');
  } catch (error) {
    showToast('Error generating suggestions', 'error');
    console.error('Suggestion error:', error);
  } finally {
    showLoading(false);
  }
}

function analyzeAdvancedWriting(text) {
  const words = engine.getWords(text);
  const sentences = engine.getSentences(text);
  const paragraphs = engine.getParagraphs(text);
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  if (!sentenceLengths.length) {
    return {
      vocabDiversity: { basic: 0, moving: 0, root: 0, details: {}, interpretation: "" },
      longestSentence: 0,
      sentenceVarietyScore: 0,
      paragraphConsistencyScore: 0,
      topicSentenceStrength: 0,
      sentenceOpeningVariety: 0
    };
  }
  const longestSentence = Math.max(...sentenceLengths);
  const meanSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - meanSentenceLength, 2), 0) / sentenceLengths.length;
  const stdDev = Math.sqrt(variance);
  const sentenceVarietyScore = (stdDev / meanSentenceLength).toFixed(2);

  const paragraphWordCounts = paragraphs.map(p => p.trim().split(/\s+/).length);
  const meanParagraphLength = paragraphWordCounts.reduce((a, b) => a + b, 0) / paragraphWordCounts.length;
  const consistentParagraphs = paragraphWordCounts.filter(count => Math.abs(count - meanParagraphLength) <= 0.2 * meanParagraphLength).length;
  const paragraphConsistencyScore = ((consistentParagraphs / paragraphs.length) * 100).toFixed(1);

  const topicSentenceScores = paragraphs.map(p => {
    const firstSentence = p.split(/[.!?]+/)[0] || "";
    const count = firstSentence.trim().split(/\s+/).length;
    if (count >= 8 && count <= 20) return 100;
    if (count < 8) return (count / 8) * 100;
    return Math.max(0, 100 - ((count - 20) / 10) * 100);
  });
  const avgTopicSentenceStrength = (topicSentenceScores.reduce((a, b) => a + b, 0) / topicSentenceScores.length).toFixed(0);

  const firstWords = sentences.map(s => s.trim().split(/\s+/)[0].toLowerCase());
  const uniqueFirstWords = new Set(firstWords).size;
  const sentenceOpeningVariety = ((uniqueFirstWords / sentences.length) * 100).toFixed(1);

  const vocabularyAnalysis = EnhancedVocabularyAnalyzer.analyzeVocabularyDiversity(text);

  return {
    vocabDiversity: {
      basic: vocabularyAnalysis.basic,
      moving: vocabularyAnalysis.moving,
      root: vocabularyAnalysis.root,
      details: vocabularyAnalysis.details,
      interpretation: vocabularyAnalysis.interpretation
    },
    longestSentence,
    sentenceVarietyScore,
    paragraphConsistencyScore,
    topicSentenceStrength: avgTopicSentenceStrength,
    sentenceOpeningVariety
  };
}

function calculateOverallWritingScore(analysis) {
  const rScore = parseFloat(analysis.readability.score) || 0;
  const c = analysis.complexity;
  const compAvg = (c.vocabularyScore + c.sentenceScore + c.structureScore + c.technicalScore) / 4;
  const overall = (rScore + compAvg) / 2;
  return Math.round(Math.max(0, Math.min(100, overall)));
}

const engine = new SmartDocProEngine();
const snippetAnalyzer = new AdditionalTextAnalyzer();

// Configure Marked (with highlight)
marked.setOptions({
  highlight: function (code, lang) {
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

const editor = document.getElementById('editor');
const previewContent = document.getElementById('preview-content');
const metrics = document.getElementById('metrics');
const insightsContainer = document.getElementById('insights');
const toast = document.getElementById('toast');

/*****************************************************************
 * Custom Code for stats
 *****************************************************************/

// Updated switchTab function (no longer forces stats sections to open checked)
function switchTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));
  const activeTab = Array.from(tabs).find(t => t.getAttribute('data-tab').toLowerCase() === tabName);
  if (activeTab) {
    activeTab.classList.add('active');
    updatePreview(editor.value);
  }
}

function updatePreview(text) {
  const activeTab = document.querySelector('.tab.active').getAttribute('data-tab').toLowerCase();
  switch (activeTab) {
    case 'preview':
      // Sanitize with DOMPurify:
      previewContent.innerHTML = DOMPurify.sanitize(marked.parse(text));
      break;
    case 'outline':
      previewContent.innerHTML = generateOutline(text);
      break;
    case 'keywords':
      previewContent.innerHTML = generateKeywords(text);
      break;
    case 'stats':
      previewContent.innerHTML = generateStats(text);
      break;
  }
}

function generateStats(text) {
  const analysis = engine.analyzeDocument(text);
  const { basic, readability, complexity, lexicalDensity } = analysis;
  const advanced = analyzeAdvancedWriting(text);

  const overallWritingScore = calculateOverallWritingScore(analysis);

  const realWorldHTML = `
    <p>A typical academic essay has a readability score of 60-70. You're at <strong>${readability.score}</strong>.</p>
    <p>A news article usually has a lexical density of ~50%. You're at <strong>${lexicalDensity.density}%</strong>.</p>
  `;

  return `
    <div class="stats-container">

      <!-- Overall Score -->
      <div class="stats-section">
        <div class="stats-header" data-toggle="overall-stats">Overall Writing Score</div>
        <div class="stats-content" id="overall-stats">
          ${createMetricCard("fas fa-star", overallWritingScore, "Overall Score (0-100)", "A simple aggregate metric for your writing quality.")}
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-header" data-toggle="basic-stats">Basic Statistics</div>
        <div class="stats-content" id="basic-stats">
          ${createMetricCard("fas fa-book", basic.words, "Words", "Total number of words in your document.")}
          ${createMetricCard("fas fa-keyboard", basic.chars, "Characters", "Total number of characters in your document.")}
          ${createMetricCard("fas fa-comment", basic.sentences, "Sentences", "Total number of sentences in your document.")}
          ${createMetricCard("fas fa-paragraph", basic.paragraphs, "Paragraphs", "Total number of paragraphs in your document.")}
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-header" data-toggle="readability-stats">Readability</div>
        <div class="stats-content" id="readability-stats">
          ${createMetricCard("fas fa-align-left", readability.avgSentenceLength, "Avg. Sentence Length", "Average number of words per sentence.")}
          ${createMetricCard("fas fa-sort-numeric-down", readability.avgSyllablesPerWord, "Avg. Syllables/Word", "Average syllables per word.")}
          ${createMetricCard("fas fa-graduation-cap", readability.grade, "Flesch-Kincaid Grade", "Approximate U.S. school grade level.")}
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-header" data-toggle="complexity-stats">Complexity</div>
        <div class="stats-content" id="complexity-stats">
          ${createMetricCard("fas fa-layer-group", complexity.complexWords, "Complex Words", "Number of words with more than two syllables.")}
          ${createMetricCard("fas fa-text-width", parseFloat(basic.avgWordLength).toFixed(1), "Avg. Word Length", "Average length of words in characters.")}
          ${createMetricCard("fas fa-text-height", advanced.longestSentence, "Longest Sentence", "Word count of the longest sentence.")}
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-header" data-toggle="advanced-stats">Advanced Writing Insights</div>
        <div class="stats-content" id="advanced-stats">
          ${createMetricCard("fas fa-book-open", advanced.vocabDiversity.basic + "%", "Vocabulary Diversity", "Basic Type-Token Ratio.")}
          ${createMetricCard("fas fa-sliders-h", advanced.sentenceVarietyScore, "Sentence Variety", "Coefficient of variation in sentence lengths.")}
          ${createMetricCard("fas fa-columns", advanced.paragraphConsistencyScore + "%", "Paragraph Consistency", "Percentage of paragraphs within 20% of average length.")}
          ${createMetricCard("fas fa-quote-left", advanced.topicSentenceStrength, "Topic Sentence Strength", "Average strength of opening sentences in paragraphs.")}
          ${createMetricCard("fas fa-quote-right", advanced.sentenceOpeningVariety + "%", "Sentence Opening Variety", "Percentage of unique first words in sentences.")}
        </div>
      </div>

      <!-- Real-World Examples -->
      <div class="stats-section">
        <div class="stats-header" data-toggle="comparison-stats">Comparison to Real-World Examples</div>
        <div class="stats-content" id="comparison-stats">
          ${realWorldHTML}
        </div>
      </div>

    </div>
  `;
}

function createMetricCard(iconClass, value, label, infoText) {
  return `
    <div class="metric-card">
      <i class="${iconClass} metric-icon"></i>
      <div class="metric-value">${value}</div>
      <div class="metric-label">${label}
        <span class="metric-info" data-info="${infoText}"></span>
      </div>
    </div>
  `;
}

function generateOutline(text) {
  const headings = text.match(/#{1,6}\s+.+/g) || [];
  if (headings.length === 0) return '<p>No headings found to generate an outline.</p>';
  let outlineHTML = '<div class="outline-container"><ul>';
  headings.forEach(h => {
    const level = h.match(/#{1,6}/)[0].length;
    const title = h.replace(/#{1,6}\s+/, '');
    outlineHTML += `<li style="margin-left: ${(level - 1) * 20}px;">${title}</li>`;
  });
  outlineHTML += '</ul></div>';
  return outlineHTML;
}

function generateKeywords(text) {
  const words = engine.getWords(text);
  const frequency = {};
  words.forEach(w => {
    if (w.length > 3) frequency[w] = (frequency[w] || 0) + 1;
  });
  const sortedWords = Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0, 20);
  if (sortedWords.length === 0) return '<p>No keywords found.</p>';
  let keywordsHTML = '<div class="keyword-cloud">';
  sortedWords.forEach(([word, count]) => {
    const fontSize = Math.min(2 + count * 0.1, 3.5);
    keywordsHTML += `<span class="keyword" style="font-size: ${fontSize}rem;">${word}</span>`;
  });
  keywordsHTML += '</div>';
  return keywordsHTML;
}

async function analyzeDocument() {
  const text = editor.value;
  if (!text.trim()) {
    showToast('Please enter some text to analyze', 'error');
    return;
  }
  showToast('Analyzing document...', 'info');
  showLoading(true);
  await new Promise(r => setTimeout(r, 1000));
  try {
    const analysis = engine.analyzeDocument(text);
    updateMetrics(analysis);
    updateInsights(analysis);
    snippetAnalyzer.analyze(text);
    showToast('Analysis complete!', 'success');
  } catch (error) {
    showToast('Error analyzing document', 'error');
    console.error('Analysis error:', error);
  } finally {
    showLoading(false);
  }
}

function updateMetrics(analysis) {
  const { basic, readability, complexity, sentiment, lexicalDensity } = analysis;
  metrics.innerHTML = `
    ${createMetricCard("fas fa-book", basic.words, "Total Words", "Total number of words in your document.")}
    ${createMetricCard("fas fa-clock", Math.ceil(basic.words / 200), "Min. Read Time", "Estimated time required to read (minutes).")}
    ${createMetricCard("fas fa-smile", sentiment.sentiment, "Overall Tone", "Indicates the overall sentiment of your document.")}
    ${createMetricCard("fas fa-layer-group", complexity.complexWords, "Complex Words", "Number of words with more than two syllables.")}
    ${createMetricCard("fas fa-balance-scale lexical-density", Math.round(lexicalDensity.density) + "%", "Lexical Density", "Measures the percentage of content words compared to function words.")}
  `;
}

function updateInsights(analysis) {
  const suggestions = engine.generateSuggestions(editor.value, analysis);
  if (suggestions.length === 0) {
    insightsContainer.innerHTML = `
      <h3 class="insights-title"><i class="fas fa-brain"></i> AI Insights</h3>
      <p>No suggestions at this time. Your document looks great!</p>
    `;
    return;
  }
  insightsContainer.innerHTML = `
    <h3 class="insights-title"><i class="fas fa-brain"></i> AI Insights & Suggestions</h3>
    ${suggestions.map(sug => `
      <div class="insight-card">
        <div class="insight-header">
          <i class="fas ${sug.icon} insight-icon"></i>
          <h4 class="insight-title">${sug.title}</h4>
        </div>
        <div class="insight-content">${sug.content}</div>
      </div>
    `).join('')}
  `;
}

function showToast(message, type = 'info', duration = 3000) {
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function showLoading(show) {
  const existingOverlay = document.querySelector('.loading-overlay');
  if (show) {
    if (!existingOverlay) {
      const overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = `<div class="spinner"></div><div class="loading-text">Processing...</div>`;
      document.querySelector('.container').appendChild(overlay);
    }
  } else {
    if (existingOverlay) existingOverlay.remove();
  }
}

function clearDocument() {
  if (confirm('Are you sure you want to clear the document? This action cannot be undone.')) {
    editor.value = '';
    previewContent.innerHTML = '';
    metrics.innerHTML = `
      ${createMetricCard("fas fa-book", 0, "Total Words", "Total number of words in your document.")}
      ${createMetricCard("fas fa-clock", 0, "Min. Read Time", "Estimated minimum time required to read the document.")}
      ${createMetricCard("fas fa-smile", "Neutral", "Overall Tone", "Indicates the overall sentiment of your document.")}
      ${createMetricCard("fas fa-layer-group", 0, "Complex Words", "Number of words with more than two syllables.")}
      ${createMetricCard("fas fa-balance-scale lexical-density", "0%", "Lexical Density", "Measures the percentage of content words compared to function words.")}
    `;
    insightsContainer.innerHTML = `
      <h3 class="insights-title"><i class="fas fa-brain"></i> AI Insights</h3>
      <p>No insights available. Start analyzing your document!</p>
    `;
    showToast('Document cleared', 'success');
    engine.readingTimeChart.data.datasets[0].data = [0, 0, 0];
    engine.readingTimeChart.update();
    engine.complexityChart.data.datasets[0].data = [0, 0, 0, 0, 0];
    engine.complexityChart.update();
    engine.transitionChart.data.labels = [];
    engine.transitionChart.data.datasets[0].data = [];
    engine.transitionChart.update();
    engine.lexicalDensityChart.data.datasets[0].data = [0, 0];
    engine.lexicalDensityChart.update();
    snippetAnalyzer.cohesionChart.data.labels = [];
    snippetAnalyzer.cohesionChart.data.datasets.forEach(ds => ds.data = []);
    snippetAnalyzer.cohesionChart.update();
    snippetAnalyzer.emotionalChart.data.labels = [];
    snippetAnalyzer.emotionalChart.data.datasets.forEach(ds => ds.data = []);
    snippetAnalyzer.emotionalChart.update();
    snippetAnalyzer.argumentChart.data.datasets[0].data = [];
    snippetAnalyzer.argumentChart.update();
  }
}

/*****************************************************************
 * DOMContentLoaded: Setup, Pre-fill, and Additional Event Listeners
 *****************************************************************/
document.addEventListener('DOMContentLoaded', () => {
  // Configure Marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    }
  });

  // these updated CSS for stats sections with expand/collapse indicators
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      /* Hide all stats content by default */
      .stats-content {
        display: none;
        padding: var(--spacing-md);
      }
      
      .stats-header {
        cursor: pointer;
        user-select: none;
        position: relative;
        padding-right: 2rem;
      }
      
      /* Add expand/collapse indicator */
      .stats-header::after {
        content: '+';
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        transition: transform 0.3s;
      }
      
      .stats-header.active::after {
        content: '-';
      }
      
      .stats-header:hover {
        background: rgba(79, 70, 229, 0.1);
      }
    </style>
  `);

  // Theme switcher functionality
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      themeOptions.forEach(opt => opt.classList.remove('active'));
      // Add active class to clicked option
      option.classList.add('active');
      // Set theme
      const theme = option.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
    });
  });

  // i think click handler for stats headers (using event delegation)
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.stats-header');
    if (header) {
      const contentId = header.getAttribute('data-toggle');
      if (contentId) {
        toggleStatsSection(contentId);
      }
    }
  });

  // Example pre-filled content
  editor.value = `# Smart Document Analysis Example

## Introduction
This document demonstrates the capabilities of SmartDoc Pro 2.0, an advanced tool for analyzing and enhancing text.

## Key Features
* Real-time markdown preview
* Hand-crafted smart Algorithmic Analysis
* Smart suggestions
* Cohesion, Emotional, Argument analysis

## Technical Details
The system uses advanced algorithms to assess document structure, readability, complexity, cohesion, emotional tone, and argument strength.

## Conclusion
Overall, SmartDoc Pro 2.0 greatly streamlines the process of evaluating and improving your documents.

[1] Reference example and thanks for clicking on my project. HMU @arsenie_slumerican on tg if you want to reach out to me. 
`;
  updatePreview(editor.value);
  snippetAnalyzer.analyze(editor.value);
  analyzeDocument();

  // Keyboard shortcuts which work like magic
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          analyzeDocument();
          break;
        case 'l':
          e.preventDefault();
          clearDocument();
          break;
      }
    }
  });

  // Added event listeners for buttons (replacing inline onclick) checked
  document.getElementById('analyzeBtn').addEventListener('click', analyzeDocument);
  document.getElementById('suggestBtn').addEventListener('click', suggestContinuation);
  document.getElementById('clearBtn').addEventListener('click', clearDocument);

  // Added event listeners for tabs (using data-tab attribute) checked
  document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', function() {
          switchTab(this.getAttribute('data-tab'));
      });
  });
});

// Helper function: Toggle stats section visibility and close others
function toggleStatsSection(id) {
  const section = document.getElementById(id);
  const header = document.querySelector(`[data-toggle="${id}"]`);
  if (!section || !header) return;
  
  // Close all other sections
  document.querySelectorAll('.stats-content').forEach(content => {
    if (content.id !== id) {
      content.style.display = 'none';
      const otherHeader = document.querySelector(`[data-toggle="${content.id}"]`);
      if (otherHeader) otherHeader.classList.remove('active');
    }
  });
  
  // Toggle current section
  const currentDisplay = window.getComputedStyle(section).display;
  section.style.display = currentDisplay === 'none' ? 'block' : 'none';
  header.classList.toggle('active');
}
