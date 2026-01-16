export const calculateComplexity = (code) => {
  const lines = code.split('\n').length;
  if (lines < 10) return 'Low';
  if (lines < 50) return 'Medium';
  return 'High';
};

export const streamText = async (text, setStreamedText, speed = 20) => {
  setStreamedText("");
  for (let i = 0; i < text.length; i++) {
    setStreamedText(prev => prev + text[i]);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
};
