const fs = require('fs').promises;

async function loadPoliciesFromFile(filename) {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
}

function simpleSummarize(text, maxLength = 500) {
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
    let summary = '';
    for (let sentence of sentences) {
        if ((summary + sentence).length <= maxLength) {
            summary += sentence;
        } else {
            break;
        }
    }
    return summary.trim();
}

async function getTrumpChatbotResponse(userMessage) {
    console.log('User Message:', userMessage);

    const policies = await loadPoliciesFromFile('trump_policies.json');
    console.log('Loaded Policies:', policies);

    const lowerCaseMessage = userMessage.toLowerCase();
    
    const keywordMap = {
        'immigration': ['immigration', 'migrant', 'border', 'alien', 'illegal'],
        'economy': ['economy', 'economic', 'job', 'trade', 'tax', 'inflation', 'prices', 'spending'],
        'healthcare': ['healthcare', 'health', 'medical', 'insurance'],
        'education': ['education', 'school', 'student', 'teacher'],
        'foreign policy': ['foreign policy', 'international', 'diplomacy', 'military'],
        'energy': ['energy', 'oil', 'gas', 'renewable'],
        'social security': ['social security', 'retirement', 'pension'],
        'veterans': ['veteran', 'military service', 'armed forces'],
    };

    function policyRelevance(policy, keywords) {
        const policyText = `${policy.issue} ${policy.commitment} ${policy.ideas.map(idea => `${idea.title} ${idea.description}`).join(' ')}`.toLowerCase();
        return keywords.filter(keyword => policyText.includes(keyword)).length;
    }

    let relevantPolicies = [];
    let topicKeywords = [];
    for (const [topic, keywords] of Object.entries(keywordMap)) {
        if (keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
            topicKeywords = keywords;
            relevantPolicies = policies
                .map(policy => ({policy, relevance: policyRelevance(policy, keywords)}))
                .filter(({relevance}) => relevance > 0)
                .sort((a, b) => b.relevance - a.relevance)
                .map(({policy}) => policy)
                .slice(0, 3);  // Increased to top 3 most relevant policies
            if (relevantPolicies.length > 0) break;
        }
    }

    if (relevantPolicies.length > 0) {
        const responses = relevantPolicies.map(policy => {
            const commitmentSummary = simpleSummarize(policy.commitment, 500);

            const relevantIdeas = policy.ideas
                .filter(idea => policyRelevance({issue: idea.title, commitment: idea.description, ideas: []}, topicKeywords) > 0)
                .slice(0, 3);  // Increased to top 3 most relevant ideas

            let ideasSummary = '';
            if (relevantIdeas.length > 0) {
                const allIdeas = relevantIdeas.map(idea => idea.description).join(' ');
                ideasSummary = simpleSummarize(allIdeas, 500);
            }

            return `On ${policy.issue}, Trump's stance is: ${commitmentSummary}${ideasSummary ? `\n\nKey ideas: ${ideasSummary}` : ''}`;
        });
        return responses.join('\n\n');
    } else {
        return "I don't have specific information on that topic, but I'd be happy to discuss other issues important to the Trump campaign. Try searching with key issues such as immigration, the economy, and education.";
    }
}

module.exports = {
    getTrumpChatbotResponse,
};