import axios, { AxiosInstance } from 'axios';

export class HttpClient {
  private readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  public get(url: string, params?: object) {
    return this.instance.get(url, { params });
  }
}
