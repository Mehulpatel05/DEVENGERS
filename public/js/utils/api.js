export async function analyzeResume(resumeText, jobDescriptionText) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeText, jobDescriptionText })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong reading that scan. Try again.');
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'Something went wrong reading that scan. Try again.'
    };
  }
}
