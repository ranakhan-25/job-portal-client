// lib/accessUser.ts

export const accessUser = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    console.log(data)

    return data.user;

    

  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};