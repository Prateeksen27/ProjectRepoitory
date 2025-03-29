export const findJoinedAgo = (joinedAt) => {
    const date = new Date(joinedAt);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options); // e.g., "10 Jan 2022"
  
    const diffInMs = Date.now() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
    return `${formattedDate} (${diffInDays} days ago)`;
  }