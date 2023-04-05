import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private org = environment.azure.org;
  private project = environment.azure.project;
  private token = environment.azure.token;
  private apiVersion = '7.0';
  private url = `https://dev.azure.com/${this.org}/${this.project}/_apis/wit/wiql?api-version=${this.apiVersion}`;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(':' + this.token)}`
  });

  constructor(private http: HttpClient) {
  }

  updateWorkItemTitle(workItemId: number, newTitle: string): Observable<any> {
    const url = `https://dev.azure.com/${this.org}/${this.project}/_apis/wit/workitems/${workItemId}?api-version=7.0`;

    const data = [
      {
        "op": "replace",
        "path": "/fields/System.Title",
        "value": newTitle
      }
    ];

    const headers = new HttpHeaders({ 'Content-Type': 'application/json-patch+json' });

    return this.http.patch(url, data, { headers: headers });
  }

  async getWorkItems(): Promise<any[]> {
    const wiql = `SELECT [System.Id], [System.Title], [System.State] FROM WorkItems`;

    const data = {
      query: wiql
    };

    const result: any = await this.http.post(this.url, data, { headers: this.headers }).toPromise();
    const workItemIds = result.workItems.map((workItem: { id: any; }) => workItem.id);
    const workItems: any[] = [];

    for (const chunk of this.chunkArray(workItemIds, 200)) {
      const ids = chunk.join(',');
      const workItemsUrl = `https://dev.azure.com/${this.org}/${this.project}/_apis/wit/workitems?ids=${ids}&$expand=relations&api-version=7.0`;
      const chunkWorkItems: any = await this.http.get<any[]>(workItemsUrl, { headers: this.headers }).toPromise();

      for (const key of Object.keys(chunkWorkItems.value)) {
        const workItem = chunkWorkItems.value[key];
        const fields = Object.keys(workItem.fields).reduce((acc: any, key: string) => {
          if (key.includes('System')) {
            const newKey = key.replace('System.', '');
            acc[newKey] = workItem.fields[key];
          }
          return acc;
        }, {});

        workItems.push(Object.assign({}, workItem, { fields }));
      }
    }

    return workItems;
  }

  chunkArray(arr: any[], chunkSize: number): any[][] {
    const chunks: any[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }
}