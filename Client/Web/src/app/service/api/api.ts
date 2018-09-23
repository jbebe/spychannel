import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

enum HttpVerb {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete'
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {
  }

  private static getNormalizedPath(path: Array<any> | string): string {
    if (typeof(path) !== typeof('')) {
      // @ts-ignore: Callback signature mismatch
      path = (<Array<any>>path).map(String.prototype.constructor).join('/');
    }
    return `${environment.chatApiEndpoint}/${path}`;
  }

  private verb<T>(verb: string, path: Array<any> | string, model?: Object, options: Object = {}): Promise<T> {
    const normalizedPath = ApiService.getNormalizedPath(path);
    if (model) {
      if (verb === HttpVerb.Delete) {
        const deleteOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          body: model
        };
        options = { ...options, ...deleteOptions };
        return this.http
          .request(HttpVerb.Delete, normalizedPath, options)
          .toPromise() as Promise<T>;
      } else {
        return this.http[verb](normalizedPath, model, options).toPromise() as Promise<T>;
      }
    } else {
      return this.http[verb](normalizedPath, options).toPromise() as Promise<T>;
    }
  }

  get<T>(path: Array<any> | string, options?: Object): Promise<T> {
    return this.verb<T>(HttpVerb.Get, path, undefined, options);
  }

  create<T>(path: Array<any> | string, model: Object, options?: Object): Promise<T> {
    return this.verb<T>(HttpVerb.Post, path, model, options);
  }

  delete(path: Array<any> | string, model?: Object, options?: Object): Promise<any> {
    return this.verb<any>(HttpVerb.Delete, path, model, options);
  }

  update<T>(path: Array<any> | string, model: Object, options?: Object): Promise<T> {
    return this.verb<T>(HttpVerb.Put, path, model, options);
  }
}
