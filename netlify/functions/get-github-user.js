export async function handler(event) {
  const username = event.queryStringParameters?.username || "octocat";
  const token = process.env.GITHUB_TOKEN;

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Authorization: `token ${token}` },
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
}
