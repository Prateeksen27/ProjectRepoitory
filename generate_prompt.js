export const genPrompt = (name,lang,desg) => {
    const prompt = ` 
  Generate a short 'About' section (within 70 words) starting with 'Hello Coders! 👋', 'Hello ProjectRepo Family!', or 'Hello Family!'.
   It should introduce the person using their name ([${name}]), designation ([${desg}]), and programming languages they specialize in ([${lang}]).
    The tone should be engaging and welcoming,
    emphasizing passion for technology, innovation, and community growth.
    
    just give me the about in plain text dont give me options you decide the tone and the content and use emojies yr 
    every time generate diff ans 
    `
    return prompt
}
