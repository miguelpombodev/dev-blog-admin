import { cookies } from "next/headers";

type UrlsMapType = {
  github: string;
  devblog: string;
};

export default class FetchApiClient {
  private readonly _cacheTime: number;

  private getUrl(flag: keyof UrlsMapType): string {
    const urlsMap: UrlsMapType = {
      github: process.env.NEXT_GITHUB_BASE_URL ?? "",
      devblog: process.env.NEXT_PUBLIC_DEV_BLOG_API_URL ?? "",
    };

    if (!urlsMap[flag]) {
      throw new Error(`Missing env variable for API base URL: ${flag}`);
    }

    return urlsMap[flag];
  }

  constructor() {
    this._cacheTime = 60;
  }
  public async Get<T>(
    flag: keyof UrlsMapType,
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const baseUrl = this.getUrl(flag);
    console.log(`${baseUrl}/${url}`);
    const res = await fetch(`${baseUrl}/${url}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const json: T = await res.json();

    return json;
  }

  public async Post<T>(
    flag: keyof UrlsMapType,
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const baseUrl = this.getUrl(flag);

    const cookie = (await cookies()).get("loginCredentials");

    console.log(options?.body);

    const res = await fetch(`${baseUrl}/${url}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: `loginCredentials=${cookie?.value}`,
      },
      credentials: "include",
      method: "POST",
      ...options,
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const json: T = await res.json();

    return json;
  }

  public async Put<T>(
    flag: keyof UrlsMapType,
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const baseUrl = this.getUrl(flag);

    const cookie = (await cookies()).get("loginCredentials");

    console.log("REQUEST INFO --- ", {
      url: `${baseUrl}/${url}`,
      options: options?.body,
    });

    const headers: HeadersInit = {
      Cookie: `loginCredentials=${cookie?.value}`,
    };

    if (!(options?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${baseUrl}/${url}`, {
      cache: "no-store",
      headers,
      credentials: "include",
      method: "PUT",
      ...options,
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const json: T = await res.json();

    return json;
  }

  public async Patch<T>(
    flag: keyof UrlsMapType,
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const baseUrl = this.getUrl(flag);

    const cookie = (await cookies()).get("loginCredentials");

    console.log("REQUEST INFO --- ", {
      url: `${baseUrl}/${url}`,
      options: options?.body,
    });

    const headers: HeadersInit = {
      Cookie: `loginCredentials=${cookie?.value}`,
    };

    if (!(options?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${baseUrl}/${url}`, {
      cache: "no-store",
      headers,
      credentials: "include",
      method: "PATCH",
      ...options,
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const json: T = await res.json();

    return json;
  }

  public async Delete<T>(
    flag: keyof UrlsMapType,
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const baseUrl = this.getUrl(flag);

    const cookie = (await cookies()).get("loginCredentials");

    const headers: HeadersInit = {
      Cookie: `loginCredentials=${cookie?.value}`,
    };

    console.log(`${baseUrl}/${url}`);

    const res = await fetch(`${baseUrl}/${url}`, {
      cache: "no-store",
      headers,
      credentials: "include",
      method: "DELETE",
      ...options,
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const json: T = await res.json();

    return json;
  }
}
