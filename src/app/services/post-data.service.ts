import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostDataService {
  constructor() {}

  async postData(data: any, url: string) {
    if (!environment.production) {
      this._exportAsJSON(data);
      return;
    }
    await this._postData(data, url);
  }
  private async _postData(data: any, url: string) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data, null, 2),
      });
    } catch (e) {
      console.error(e);
    }
  }
  private _exportAsJSON(exportData: any) {
    const jsonData = JSON.stringify(exportData, null, 2);
    this._downloadFile(jsonData, 'data.json', 'application/json');
  }
  private _downloadFile(content: any, filename: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}
