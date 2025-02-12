# Methodology – SmartDoc Pro 2.0

## Overview
SmartDoc Pro 2.0 employs a computational methodology designed for high-precision textual analysis.

---

## 1️⃣ **Reading Time Estimation**
```math
\text{Reading Time (seconds)} = \left( \frac{\text{Word Count}}{238} \right) \times 60
```
- **Quick Read:** Adjusted by **0.7** (skimming speed)
- **Medium Read:** Standard reading time (**238 wpm**)
- **Thorough Read:** Adjusted by **1.3** (deep reading speed)
- **Handles Edge Cases:** If **word count = 0**, return **[0, 0, 0]**

---

## 2️⃣ **Complexity Analysis**
### **Vocabulary Score**
```math
\text{Vocabulary Score} = \left( \frac{\text{Unique Words}}{\text{Total Words}} \right) \times 100
```

### **Sentence Complexity**
```math
\text{Sentence Complexity} = \left( \frac{\text{Average Sentence Length}}{30} \right) \times 100
```
- Normalized **between 0-100**.
- Higher values **indicate more complex sentence structures**.

### **Readability Index (Flesch-Kincaid)**
```math
\text{Readability Score} = 206.835 - (1.015 \times \text{ASL}) - (84.6 \times \text{ASW})
```
- **ASL** = Average Sentence Length (**words per sentence**)
- **ASW** = Average Syllables per Word
- **Clamped between 0-100** in the code to avoid outliers.

---

## 3️⃣ **Lexical Density Measurement**
```math
\text{Lexical Density} = \left( \frac{\text{Content Words}}{\text{Total Words}} \right) \times 100
```
- **Content Words:** Nouns, verbs, adjectives, adverbs.
- **Function Words:** Articles, prepositions, conjunctions.
- **Handles Edge Cases:** If **total words = 0**, returns **[50, 50]**.

---

## 4️⃣ **Cohesion & Coherence Metrics**
### **Transition Normalization**
```math
\text{Normalized Transitions} = \left( \frac{\text{Total Transitions}}{\max(\text{Transitions}, 5)} \right) \times 100
```
- **Ensures transitions are mapped to 0-100 scale**.
- **Minimum value of 5 is enforced** to prevent division by zero.

### **Coherence Scoring**
```math
\text{Coherence Score} = \left( \frac{\text{Logical Transitions} + \text{Referential Connections}}{\text{Total Sentences}} \right) \times 100
```
- **Ensures sentence-level cohesion analysis.**
- **Normalized and clamped to prevent extreme values.**

---

## 5️⃣ **Sentence Variety Analysis**
### **Structural Variety Score**
```math
\text{Variety Score} = 100 - \left( \sum_{i=1}^{n} |S_i - S_{i-1}| \right)
```
- **Measures fluctuations in sentence lengths**.
- **Higher variation = more dynamic writing.**

### **Opening Variety**
```math
\text{Unique Openings} = \left( \frac{\text{Unique Sentence Starters}}{\text{Total Sentences}} \right) \times 100
```
- Higher values **indicate diverse sentence structures**.
- **Now includes sentence smoothing for a more stable measure.**

---

## 6️⃣ **Sentiment Analysis**
### **Polarity Score Calculation**
```math
\text{Sentiment Score} = \sum (\text{Word Score})
```
- **Each word is mapped to a sentiment lexicon.**
- **No intensity factors used.**
- **No negation flipping is applied.**
- **Summation-based score, not scaled.**

---

## 7️⃣ **Keyword Frequency Analysis**
```math
\text{Keyword Frequency} = \left( \frac{\text{Keyword Occurrences}}{\text{Total Words}} \right) \times 100
```
- **Tracks keyword density in the text**.
- **Useful for SEO and content optimization**.

---

## 8️⃣ **Writing Style Evolution**
### **Readability Over Time**
```math
\text{Readability Change} = \frac{\sum_{i=1}^{n} (\text{Readability}_{i} - \text{Readability}_{i-1})}{n}
```
- **Tracks readability changes across multiple sections.**
- **Detects whether writing is becoming clearer or more complex over time.**

---

## **Final Thoughts**
SmartDoc Pro 2.0 is built on a solid **computational foundation** with refined formulas for **accuracy, scalability, and usability**. Each method is optimized for **real-time analysis,** ensuring high-quality insights for writers, researchers, and professionals. 
